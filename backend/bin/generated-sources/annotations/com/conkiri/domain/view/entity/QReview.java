package com.conkiri.domain.view.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QReview is a Querydsl query type for Review
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QReview extends EntityPathBase<Review> {

    private static final long serialVersionUID = 1590950400L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QReview review = new QReview("review");

    public final com.conkiri.global.domain.QBaseTime _super = new com.conkiri.global.domain.QBaseTime(this);

    public final com.conkiri.domain.base.entity.QConcert concert;

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifyTime = _super.modifyTime;

    public final StringPath photoUrl = createString("photoUrl");

    public final NumberPath<Long> reviewId = createNumber("reviewId", Long.class);

    public final com.conkiri.domain.base.entity.QSeat seat;

    public final EnumPath<SeatDistance> seatDistance = createEnum("seatDistance", SeatDistance.class);

    public final EnumPath<Sound> sound = createEnum("sound", Sound.class);

    public final EnumPath<com.conkiri.domain.base.entity.StageType> stageType = createEnum("stageType", com.conkiri.domain.base.entity.StageType.class);

    public final com.conkiri.domain.user.entity.QUser user;

    public final NumberPath<Integer> viewScore = createNumber("viewScore", Integer.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> writeTime = _super.writeTime;

    public QReview(String variable) {
        this(Review.class, forVariable(variable), INITS);
    }

    public QReview(Path<? extends Review> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QReview(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QReview(PathMetadata metadata, PathInits inits) {
        this(Review.class, metadata, inits);
    }

    public QReview(Class<? extends Review> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.concert = inits.isInitialized("concert") ? new com.conkiri.domain.base.entity.QConcert(forProperty("concert"), inits.get("concert")) : null;
        this.seat = inits.isInitialized("seat") ? new com.conkiri.domain.base.entity.QSeat(forProperty("seat"), inits.get("seat")) : null;
        this.user = inits.isInitialized("user") ? new com.conkiri.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

