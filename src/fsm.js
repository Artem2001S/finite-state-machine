class FSM {
	/**
	 * Creates new FSM instance.
	 * @param config
	 */
  constructor(config) {
    this.config = config;
    this.state = config.initial;
    this.states = Object.keys(config.states);
    this.prevState = null;
    this.countOfChangeStates = 0;
    this.canRedo = false;
  }

	/**
	 * Returns active state.
	 * @returns {String}
	 */
  getState() {
    return this.state;
  }

	/**
	 * Goes to specified state.
	 * @param state
	 */
  changeState(state) {
    if (this.states.indexOf(state) === -1) throw new Error();
    else {
      this.prevState = this.state;
      this.state = state;
    }
    this.countOfChangeStates++;
    this.canRedo = false;

  }

	/**
	 * Changes state according to event transition rules.
	 * @param event
	 */
  trigger(event) {
    if (this.config.states[this.state].transitions[event] === undefined) throw new Error();
    else {
      this.prevState = this.state;
      this.state = this.config.states[this.state].transitions[event];
    }
    this.countOfChangeStates++;
    this.canRedo = false;
  }

	/**
	 * Resets FSM state to initial.
	 */
  reset() {
    this.state = this.config.initial;
  }

	/**
	 * Returns an array of states for which there are specified event transition rules.
	 * Returns all states if argument is undefined.
	 * @param event
	 * @returns {Array}
	 */
  getStates(event) {
    if (event === undefined) return this.states;
    let res = this.states.filter((_state) => {
      return this.config.states[_state].transitions[event];
    });
    return res;
  }

	/**
	 * Goes back to previous state.
	 * Returns false if undo is not available.
	 * @returns {Boolean}
	 */
  undo() {
    this.countOfChangeStates++;
    if (this.countOfChangeStates <= 1 ) return false;
    if (this.state === this.config.initial) return false;
    const tmp = this.state;
    this.state = this.prevState;
    this.prevState = tmp;
    this.canRedo = true;

    return true;
  }

	/**
	 * Goes redo to state.
	 * Returns false if redo is not available.
	 * @returns {Boolean}
	 */
  redo() {
    if (this.canRedo === false) return false;
    this.countOfChangeStates--;
    if (this.countOfChangeStates <= 0) return false;
    const tmp = this.state;
    this.state = this.prevState;
    this.prevState = tmp;
    return true;
  }

	/**
	 * Clears transition history
	 */
  clearHistory() { 
    this.countOfChangeStates = 0;
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
