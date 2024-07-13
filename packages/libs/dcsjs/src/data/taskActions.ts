import * as Enums from "./enums";
import * as Types from "./types";

export type TaskActionId =
	| "FighterSweep"
	| "AWACS"
	| "RestrictA2G"
	| "Missile AttackRange"
	| "EPLRS"
	| "Orbit"
	| "AttackGroup";

export const TaskAction = {
	FighterSweep: {
		enabled: true,
		key: "FighterSweep",
		id: "EngageTargets",
		auto: true,
		params: {
			targetTypes: ["Planes"],
			priority: 0,
		},
	} as Types.RoutePointTaskTemplate,
	AFAC: {
		enabled: true,
		auto: true,
		id: "FAC",
		params: {},
	} as Types.RoutePointTaskTemplate,
	FAC_AttackGroup: (groupId: number, frequency: number): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "FAC_AttackGroup",
		params: {
			number: 1,
			designation: "Auto",
			modulation: 0,
			groupId,
			callname: 1,
			datalink: true,
			weaponType: 9663676414,
			frequency,
		},
	}),
	AWACS: {
		auto: true,
		enabled: true,
		id: "AWACS",
		params: {},
	} as Types.RoutePointTaskTemplate,
	RestrictA2G: {
		enabled: true,
		auto: true,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: {
					value: true,
					name: 17,
				},
			},
		},
	} as Types.RoutePointTaskTemplate,
	"Missile AttackRange": {
		enabled: true,
		auto: true,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: {
					value: 3,
					name: 18,
				},
			},
		},
	} as Types.RoutePointTaskTemplate,
	EPLRS: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "EPLRS",
				params: { value: true, groupId: 0 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	AttackGroup: (groupId: number): Types.RoutePointTaskTemplate => ({
		auto: false,
		id: "AttackGroup",
		name: "",
		enabled: true,
		params: {
			groupId,
		},
	}),
	Bombing: (position: Types.Position, dive = false): Types.RoutePointTaskTemplate => ({
		auto: false,
		id: "Bombing",
		name: "",
		enabled: true,
		params: {
			...position,
			expend: "All",
			attackQty: 1,
			attackType: dive ? "Dive" : undefined,
		},
	}),
	/* Escort: (
    groupId: number,
    lastWaypointIndex: number
  ): Types.RoutePointTaskTemplate => ({
    auto: false,
    id: "Escort",
    name: "",
    enabled: true,
    params: {
      groupId,
      targetTypes: ["Fighters", "Multirole fighters"],
      value: "Fighters;Multirole fighters;",
      noTargetTypes: ["Bombers", "Helicopters", "UAVs"],
      engagementDistMax: 60000,
      pos: {
        y: 0,
        x: -500,
        z: 200,
      },
      lastWptIndexFlag: true,
      lastWptIndexFlagChangedManually: true,
      lastWptIndex: lastWaypointIndex,
    },
  }), */
	Escort: (groupId: number): Types.RoutePointTaskTemplate => ({
		auto: false,
		id: "Escort",
		enabled: true,
		params: {
			groupId,
			engagementDistMax: 74000,
			pos: {
				y: 0,
				x: -500,
				z: 200,
			},
			targetTypes: ["Fighters", "Multirole fighters"],
			noTargetTypes: ["Bombers", "Helicopters", "UAVs"],
			lastWptIndexFlagChangedManually: false,
			lastWptIndex: 3,
			lastWptIndexFlag: false,
		},
	}),
	SEAD: {
		key: "SEAD",
		id: "EngageTargets",
		enabled: true,
		auto: true,
		params: {
			targetTypes: ["Air Defence"],
			priority: 0,
		},
	} as Types.RoutePointTaskTemplate,
	SEADEscort: (groupId: number, lastWaypointIndex: number): Types.RoutePointTaskTemplate => ({
		auto: false,
		id: "Escort",
		enabled: true,
		params: {
			groupId,
			noTargetTypes: ["AAA", "SR SAM"],
			engagementDistMax: 74000,
			targetTypes: ["MR SAM", "LR SAM"],
			value: "MR SAM;LR SAM;",
			lastWptIndexFlag: true,
			lastWptIndexFlagChangedManually: true,
			lastWptIndex: lastWaypointIndex,
			pos: {
				y: 0,
				x: -1000,
				z: 200,
			},
		},
	}),
	Immortal: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "SetImmortal",
				params: { value: true },
			},
		},
	} as Types.RoutePointTaskTemplate,
	Invisible: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "SetInvisible",
				params: {
					value: true,
				},
			},
		},
	} as Types.RoutePointTaskTemplate,
	WeaponHold: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: { value: 4, name: 0 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	WeaponDesignate: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: { value: 1, name: 0 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	WeaponFree: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: { value: 0, name: 0 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	FireAtPoint: (pos: Types.Position): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "FireAtPoint",
		params: {
			y: pos.y,
			templateId: "",
			expendQtyEnabled: false,
			alt_type: 1,
			expendQty: 1,
			x: pos.x,
			weaponType: 52613349374,
			zoneRadius: 121.92,
		},
	}),
	SwitchWaypoint: (from: number, to: number): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "SwitchWaypoint",
				params: {
					goToWaypointIndex: to,
					fromWaypointIndex: from,
				},
			},
		},
	}),
	Start: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Start",
				params: {},
			},
		},
	} as Types.RoutePointTaskTemplate,
	CAS: {
		enabled: true,
		auto: false,
		id: "EngageTargets",
		key: "CAS",
		params: {
			targetTypes: ["Helicopters", "Ground Units", "Light armed ships"],
			priority: 0,
		},
	} as Types.RoutePointTaskTemplate,
	CAS_EngageTargetsInZone: (targetPosition: Types.Position): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "EngageTargetsInZone",
		params: {
			x: targetPosition.x,
			y: targetPosition.y,
			targetTypes: ["All"],
			value: "All;",
			noTargetTypes: {},
			priority: 0,
			zoneRadius: 5000,
		},
	}),
	CAP: {
		enabled: true,
		auto: false,
		id: "EngageTargets",
		params: {
			targetTypes: ["Air"],
			priority: 0,
			value: "Air;",
			noTargetTypes: ["Cruise missiles", "Antiship Missiles", "AA Missiles", "AG Missiles", "SA Missiles"],
			maxDistEnabled: true,
			maxDist: 74000,
		},
	} as Types.RoutePointTaskTemplate,
	CAP_EngageTargetsInZone: (targetPosition: Types.Position): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "EngageTargetsInZone",
		params: {
			y: targetPosition.y,
			x: targetPosition.x,
			targetTypes: ["Air"],
			value: "Air;",
			noTargetTypes: ["Cruise missiles", "Antiship Missiles", "AA Missiles", "AG Missiles", "SA Missiles"],
			priority: 0,
			zoneRadius: 74000,
		},
	}),
	RaceTrack: (altitude: number, speed: number, duration = 1800): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "ControlledTask",
		params: {
			task: {
				id: "Orbit",
				params: {
					altitude,
					pattern: "Race-Track",
					stopCondition: {
						duration,
					},
					speed,
					speedEdited: true,
				},
			},
			stopCondition: { duration },
		},
	}),
	Hold: (time: number, altitude: number, speed: number): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "ControlledTask",
		params: {
			task: {
				id: "Orbit",
				params: {
					altitude,
					pattern: "Circle",
					speed,
				},
			},
			stopCondition: { time },
		},
	}),
	Radar: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: { value: 3, name: 3 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	rtbOnOutOfAmmo: ({
		loadoutType,
		era,
	}: {
		loadoutType: "A2A" | "A2G";
		era: Enums.Era;
	}): Types.RoutePointTaskTemplate => ({
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: {
					value: loadoutType === "A2G" ? 805339120 : era === "Modern" || era === "Late CW" ? 268402688 : 264241152,
					name: 10,
				},
			},
		},
	}),
	rtbOnBingo: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: { value: true, name: 6 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	redState: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: { value: 2, name: 9 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	evadeFire: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: { value: 2, name: 1 },
			},
		},
	} as Types.RoutePointTaskTemplate,
	noContactRadio: {
		enabled: true,
		auto: false,
		id: "WrappedAction",
		params: {
			action: {
				id: "Option",
				params: {
					targetTypes: {},
					name: 21,
					value: "none;",
					noTargetTypes: [
						"Fighters",
						"Multirole fighters",
						"Bombers",
						"Helicopters",
						"UAVs",
						"Infantry",
						"Fortifications",
						"Tanks",
						"IFV",
						"APC",
						"Artillery",
						"Unarmed vehicles",
						"AAA",
						"SR SAM",
						"MR SAM",
						"LR SAM",
						"Aircraft Carriers",
						"Cruisers",
						"Destroyers",
						"Frigates",
						"Corvettes",
						"Light armed ships",
						"Unarmed ships",
						"Submarines",
						"Cruise missiles",
						"Antiship Missiles",
						"AA Missiles",
						"AG Missiles",
						"SA Missiles",
						"UAVs",
					],
				},
			},
		},
	} as Types.RoutePointTaskTemplate,
};
