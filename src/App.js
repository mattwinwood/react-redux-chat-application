// Getter and Setter
function createStore(reducer, initialState) {
    let state = initialState;

    const getState = () => (state);

    const dispatch = (action) => {
        state = reducer(state, action);
    };

    return {
        getState,
        dispatch
    };
}

// What to do to the data
function reducer(state, action) {
    if ("ADD_MESSAGE" === action.type) {
        return {
            messages : state.messages.concat(action.message)
        }
    }
    else if ("DELETE_MESSAGE" === action.type) {
        return {
            messages : [
                ...state.messages.slice(0, action.index),
                ...state.messages.slice(
                    action.index + 1, state.messages.length
                ),
            ],
        }

    } else {
        return state;
    }
}

const initialState = {messages : []};
const store = createStore(reducer, initialState);

const addMessageAction1 = {
    type : 'ADD_MESSAGE',
    message : 'How does it look, Neil?',
};

// Setter
store.dispatch(addMessageAction1);
// Getter
const stateV1 = store.getState();
const addMessageAction2 = {
    type : 'ADD_MESSAGE', message : 'Looking good.',
};
// Setter
store.dispatch(addMessageAction2);
// Getter
const stateV2 = store.getState();
console.log('State v1:');
console.log(stateV1);
console.log('State v2:');
console.log(stateV2);

const deleteMessageAction = {
    type: 'DELETE_MESSAGE',
    index: 0,
};

store.dispatch(deleteMessageAction);
const stateV3 = store.getState();

console.log('State v3:');
console.log(stateV3);
