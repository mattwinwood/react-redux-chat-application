import React from 'react';

function createStore(reducer, initialState) {
    let state = initialState;
    const listeners = [];

    const subscribe = (listener) => (
        listeners.push(listener)
    );

    const getState = () => (state);

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(l => l());
    };

    return {
        subscribe,
        getState,
        dispatch,
    };
}

function reducer(state, action) {
    if (action.type === 'ADD_MESSAGE') {
        return {
            messages: state.messages.concat(action.message),
        };
    } else if (action.type === 'DELETE_MESSAGE') {
        return {
            messages: [
                ...state.messages.slice(0, action.index),
                ...state.messages.slice(
                    action.index + 1, state.messages.length
                ),
            ],
        };
    } else {
        return state;
    }
}

const initialState = {messages: []};

const store = createStore(reducer, initialState);

const listener = () => {
    console.log('LISTENER 1Current state: ');
    console.log(store.getState());
};

store.subscribe(listener);

const addMessageAction1 = {
    type: 'ADD_MESSAGE',
    message: 'How do you read?',
};
store.dispatch(addMessageAction1);
// -> `listener()` is called

const addMessageAction2 = {
    type: 'ADD_MESSAGE',
    message: 'I read you loud and clear, Houston.',
};
store.dispatch(addMessageAction2);
// -> `listener()` is called

const deleteMessageAction = {
    type: 'DELETE_MESSAGE',
    index: 0,
};
store.dispatch(deleteMessageAction);

// -> `listener()` is called

class MessageInput extends React.Component {
    state = {
        value: '',
    };
    handleSubmit = () => {
        store.dispatch({
            type: 'ADD_MESSAGE',
            message: this.state.value,
        });
        this.setState({
            value: ''
        });
    }

    onChange = (e) => {
        this.setState({
            value: e.target.value,
        })
    };

    render() {
        return (
            <div className='ui input'>
                <input
                    onChange={this.onChange}
                    value={this.state.value}
                    type='text'
                />
                <button
                    onClick={this.handleSubmit}
                    className='ui primary button'
                    type='submit'
                >
                    Submit
                </button>
            </div>
        );
    }
}

class MessageView extends React.Component {
    handleClick = (index) => {
        store.dispatch({
            type: 'DELETE_MESSAGE',
            index: index
        });
    };

    render() {
        const messages = this.props.messages.map((message, index) => (
            <div
                className='comment'
                key={index}
                onClick={() => this.handleClick(index)}
            >
                {message}
            </div>
        ));
        return (
            <div className='ui comments'>
                {messages}
            </div>
        );
    };
}

class App extends React.Component {
    // setState with Redux managing data
    componentDidMount() {
        store.subscribe(() => this.forceUpdate());
    }

    render() {
        const messages = store.getState().messages;

        return (
            <div className='ui segment'>
                <MessageView messages={messages}/>
                <MessageInput/>
            </div>
        );
    }
}

export default App;
