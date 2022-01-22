import { createMachine } from 'xstate';

const playingMachine = {
	initial: 'selecting_piece',
	states: {
		selecting_piece: {
			always: [{ target: 'game_over', cond: 'isNoPieceLeft' }, 'piece_falling'],
			entry: ['selectRandomPiece', 'resetCoords'],
		},
		piece_falling: {
			always: [
				{ cond: 'isPieceInPlace', target: 'selecting_piece', actions: 'markPieceAsFinished' },
				{ cond: 'isPieceColliding', target: 'selecting_piece' },
				{ cond: 'isPieceOutOfBounds', target: 'selecting_piece' },
			],
			// after: { 500: { actions: 'movePieceDown', target: 'piece_falling' } },
			on: { MOVE_LEFT: { actions: 'movePieceLeft' }, MOVE_RIGHT: { actions: 'movePieceRight' } },
		},
		game_over: {
			type: 'final',
		},
	},
};

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
			grid_size: undefined,
		},
		states: {
			loading: {
				on: { INIT_GAME: { target: 'playing', actions: 'setGameVariables' } },
			},
			playing: {
				onDone: 'loading',
				...playingMachine,
			},
		},
	},
	{
		guards: {
			isPieceInPlace: () => false,
			isPieceColliding: () => false,
			isPieceOutOfBounds: () => false,
			isNoPieceLeft: () => false,
		},
	},
);
