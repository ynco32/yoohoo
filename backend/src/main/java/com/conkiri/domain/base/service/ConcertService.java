package com.conkiri.domain.base.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.dto.request.ConcertListRequestDTO;
import com.conkiri.domain.base.dto.response.ConcertResponseDTO;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.ConcertDetail;
import com.conkiri.domain.base.repository.ConcertDetailRepository;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.notification.entity.MyConcert;
import com.conkiri.domain.notification.repository.MyConcertRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConcertService {

	private final ConcertRepository concertRepository;
	private final MyConcertRepository myConcertRepository;
	private final ConcertDetailRepository concertDetailRepository;

	public ConcertResponseDTO getConcerts(Long lastConcertDetailId, String searchWord, User user) {

		return concertRepository.findConcerts(lastConcertDetailId, searchWord, user);
	}

	public ConcertResponseDTO getMyConcerts(User user) {

		return concertRepository.findMyConcerts(user);
	}

	@Transactional
	public void setMyConcerts(ConcertListRequestDTO request, User user) {

		List<MyConcert> currentMyConcerts = myConcertRepository.findByUser(user);

		Map<Long, MyConcert> currentByDetailId = mapByConcertDetail(currentMyConcerts);
		Map<Long, MyConcert> currentByConcertId = mapByConcertOnly(currentMyConcerts);
		Set<Long> newDetailIds = extractIds(request.concertDetailIds());
		Set<Long> newConcertIds = extractIds(request.concertIds());

		List<ConcertDetail> details = getValidatedConcertDetails(newDetailIds);
		Set<Long> concertIdsCoveredByDetails = extractConcertIds(details);
		newConcertIds.removeAll(concertIdsCoveredByDetails);

		List<MyConcert> toDelete = determineMyConcertsToDelete(currentMyConcerts, newDetailIds, newConcertIds);
		List<MyConcert> toSave = buildUpdatedMyConcerts(details, newConcertIds, request, currentByDetailId, currentByConcertId, user);
		persistChanges(toDelete, toSave);
	}

	private Map<Long, MyConcert> mapByConcertDetail(List<MyConcert> list) {

		return list.stream()
			.filter(mc -> mc.getConcertDetail() != null)
			.collect(Collectors.toMap(mc -> mc.getConcertDetail().getConcertDetailId(), mc -> mc, (v1, v2) -> v1));
	}

	private Map<Long, MyConcert> mapByConcertOnly(List<MyConcert> list) {

		return list.stream()
			.filter(mc -> mc.getConcertDetail() == null)
			.collect(Collectors.toMap(mc -> mc.getConcert().getConcertId(), mc -> mc, (v1, v2) -> v1));
	}

	private Set<Long> extractIds(List<Long> ids) {

		return ids != null ? new HashSet<>(ids) : Set.of();
	}

	private List<ConcertDetail> getValidatedConcertDetails(Set<Long> detailIds) {

		List<ConcertDetail> details = concertDetailRepository.findAllById(detailIds);
		if (details.size() != detailIds.size()) {
			throw new BaseException(ErrorCode.CONCERT_DETAIL_NOT_FOUND);
		}
		return details;
	}

	private Set<Long> extractConcertIds(List<ConcertDetail> details) {

		return details.stream()
			.map(d -> d.getConcert().getConcertId())
			.collect(Collectors.toSet());
	}

	private List<MyConcert> determineMyConcertsToDelete(List<MyConcert> currentList, Set<Long> newDetailIds, Set<Long> newConcertIds) {

		return currentList.stream()
			.filter(mc -> {
				if (mc.getConcertDetail() != null) {
					return !newDetailIds.contains(mc.getConcertDetail().getConcertDetailId());
				} else {
					return !newConcertIds.contains(mc.getConcert().getConcertId());
				}
			})
			.toList();
	}

	private List<MyConcert> buildUpdatedMyConcerts(List<ConcertDetail> details, Set<Long> newConcertIds, ConcertListRequestDTO request, Map<Long, MyConcert> currentByDetailId, Map<Long, MyConcert> currentByConcertId, User user) {

		List<MyConcert> result = new ArrayList<>();
		for (ConcertDetail detail : details) {
			Long detailId = detail.getConcertDetailId();
			boolean entranceEnabled = request.isEntranceNotificationEnabled(detailId);

			if (currentByDetailId.containsKey(detailId)) {
				MyConcert existing = currentByDetailId.get(detailId);
				if (existing.isEntranceNotificationEnabled() != entranceEnabled) {
					existing.updateEntranceNotification(entranceEnabled);
					result.add(existing);
				}
			} else {
				result.add(MyConcert.of(detail.getConcert(), user, detail, true, entranceEnabled));
			}
		}

		for (Long concertId : newConcertIds) {
			if (!currentByConcertId.containsKey(concertId)) {
				Concert concert = concertRepository.findById(concertId)
					.orElseThrow(() -> new BaseException(ErrorCode.CONCERT_NOT_FOUND));
				result.add(MyConcert.of(concert, user, true, false));
			}
		}
		return result;
	}

	private void persistChanges(List<MyConcert> toDelete, List<MyConcert> toSave) {

		if (!toDelete.isEmpty()) myConcertRepository.deleteAll(toDelete);
		if (!toSave.isEmpty()) myConcertRepository.saveAll(toSave);
	}

}
