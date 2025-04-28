package com.conkiri.global.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginDTO {

	private Boolean authenticated;
	private Boolean isNamed;
}
