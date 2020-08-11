import { PieceLifespan } from 'tv-automation-sofie-blueprints-integration'
import { assertUnreachable, isAdLibPiece } from '../util'

describe('util', () => {
	it('Detects AdLib piece', () => {
		expect(
			isAdLibPiece({
				_rank: 0,
				externalId: '-',
				name: 'test adlib',
				sourceLayerId: 'Cam',
				outputLayerId: 'pgm',
				lifespan: PieceLifespan.WithinPart
			})
		).toBeTruthy()

		expect(
			isAdLibPiece({
				externalId: '-',
				name: 'test non-adlib',
				sourceLayerId: 'Cam',
				outputLayerId: 'pgm',
				lifespan: PieceLifespan.WithinPart,
				enable: {
					start: 0
				}
			})
		).toBeFalsy()
	})

	it('Asserts Unreachable', () => {
		expect(() => {
			// @ts-ignore
			assertUnreachable({})
		}).toThrowError()
	})
})
