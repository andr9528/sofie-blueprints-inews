import { IBlueprintPiece, PieceLifespan } from 'tv-automation-sofie-blueprints-integration'
import { CueType } from 'tv2-constants'
import { CreateTiming } from '../cueTiming'
import { CueDefinitionUnknown } from '../inewsConversion/converters/ParseCue'
import { literal } from '../util'

describe('CreateTiming', () => {
	test('Start only (seconds)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			start: {
				seconds: 1
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 1000,
					duration: 4000
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('Start only (frames)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			start: {
				frames: 1
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 40,
					duration: 4000
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('Start only (seconds and frames)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			start: {
				seconds: 1,
				frames: 1
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 1040,
					duration: 4000
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('End only (seconds)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			end: {
				seconds: 1
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 0,
					duration: 1000
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('End only (frames)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			end: {
				frames: 1
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 0,
					duration: 40
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('End only (seconds and frames)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			end: {
				seconds: 1,
				frames: 1
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 0,
					duration: 1040
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('End only (B)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			end: {
				infiniteMode: 'B'
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 0
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('End only (S)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			end: {
				infiniteMode: 'S'
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 0
				},
				lifespan: PieceLifespan.OutOnSegmentEnd
			})
		)
	})

	test('End only (O)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			end: {
				infiniteMode: 'O'
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 0
				},
				lifespan: PieceLifespan.OutOnRundownEnd
			})
		)
	})

	test('Start and end (timing)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			start: {
				frames: 1
			},
			end: {
				seconds: 1
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 40,
					duration: 960
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})

	test('Start and end (infinite)', () => {
		const time: CueDefinitionUnknown = {
			type: CueType.Unknown,
			start: {
				frames: 1
			},
			end: {
				infiniteMode: 'B'
			},
			iNewsCommand: ''
		}
		const result = CreateTiming(time, 4000)
		expect(result).toEqual(
			literal<Pick<IBlueprintPiece, 'enable' | 'lifespan'>>({
				enable: {
					start: 40
				},
				lifespan: PieceLifespan.WithinPart
			})
		)
	})
})
