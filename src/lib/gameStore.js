import {assign, createMachine} from 'xstate'
import {NUMBER_OF_CELLS} from '$lib/constants'
import {pickRandom} from '$lib/utils/random'

const playingMachine = {
	initial: 'selecting_piece',
	states: {
		selecting_piece: {
			always: [{target: 'game_over', cond: 'isNoPieceLeft'}, 'piece_falling'],
			entry: 'selectRandomPiece',
		},
		piece_falling: {
			always: [
				{cond: 'isPieceInPlace', target: 'selecting_piece', actions: 'markPieceAsFinished'},
				{cond: 'isPieceColliding', target: 'selecting_piece'},
				{cond: 'isPieceOutOfBounds', target: 'selecting_piece'},
			],
			// after: {500: {actions: 'movePieceDown', target: 'piece_falling'}},
			on: {MOVE_LEFT: {actions: 'movePieceLeft'}, MOVE_RIGHT: {actions: 'movePieceRight'}},
		},
		game_over: {
			type: 'final',
		},
	},
}

export const gameMachine = createMachine(
	{
		id: 'game',
		initial: 'loading',
		context: {
			availablePieces: [],
			// countries that are already in their place
			finishedPieces: [],
			// the currently selected country
			currentPiece: null,
			coordinates: [0, 0],
			/* imagine dividing the map into a grid of squares, 
    this would be the size of one square. 
    E.G the distance a piece travels to the left / right / down per "tick" */
			gridSize: undefined,
			// the width and height of the grid
			gridDimensions: {width: 0, height: 0},
		},
		states: {
			loading: {
				on: {INIT_GAME: {target: 'playing', actions: 'setGameVariables'}},
			},
			playing: {
				onDone: 'loading',
				...playingMachine,
			},
		},
	},
	{
		actions: {
			setGameVariables: assign({
				availablePieces: (ctx, evt) => evt.availablePieces,
				gridSize: (ctx, evt) => evt.gridDimensions.width / NUMBER_OF_CELLS,
				gridDimensions: (ctx, evt) => evt.gridDimensions,
			}),
			selectRandomPiece: assign((ctx) => {
				const {element} = pickRandom(ctx.availablePieces)
				const bbox = element.getBBox()

				/*
					We need to make sure thatthe piece starts outside the screen
					and that the distance of the piece to its end location is divisible by the gridSize 
					so that it can land exactly in its initial location
				*/
				const minDistanceToBeOutOfScreen = -bbox.y + -bbox.height
				// round down to be a multiple of the gridSize
				const transform = Math.floor(minDistanceToBeOutOfScreen / ctx.gridSize) * ctx.gridSize

				return {
					currentPiece: {element, bbox},
					coordinates: [0, transform],
				}
			}),

			markPieceAsFinished: assign((ctx) => {
				const piece = ctx.currentPiece

				piece.element.classList.add('land-highlight')

				return {
					availablePieces: ctx.availablePieces.filter((p) => p.element !== piece.element),
				}
			}),

			// move piece
			movePieceDown: assign({
				coordinates: (ctx) => [ctx.coordinates[0], ctx.coordinates[1] + ctx.gridSize],
			}),
			movePieceLeft: assign({
				coordinates: (ctx) => [ctx.coordinates[0] - ctx.gridSize, ctx.coordinates[1]],
			}),
			movePieceRight: assign({
				coordinates: (ctx) => [ctx.coordinates[0] + ctx.gridSize, ctx.coordinates[1]],
			}),
		},
		guards: {
			isPieceInPlace: (ctx) => Math.abs(ctx.coordinates[0]) < 1 && Math.abs(ctx.coordinates[1]) < 1, // cant check if equal 0 thanks to floating point
			isPieceColliding: () => false,
			isPieceOutOfBounds: () => false,
			isNoPieceLeft: () => false,
		},
	},
)

/*
137.7 
-498.44488525390625 
-583.7897705078126

*/
