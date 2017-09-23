import React, {Component} from 'react';

import * as validators from '../../../services/validators';

import './text-field.css';

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.handleBlur = this.handleBlur.bind(this);
  }

  handleBlur(event) {
    this.isValid(true, event.target);
  }

  isValid(showErrors, target) {
    const validate = this.props.validate || [];

    const errors = validate.reduce((pre, curr) => (
      pre.concat(validators[curr](target.value))
    ), []);

    if (showErrors) {
      this.setState({ errors });
    }

    return !errors.length;
  }

  render() {
    const errors = this.state.errors;
    const name = this.props.name;

    return [
      <label key="input" className="form-label">
        { name }
        <input
          className={'form-input' + (errors.length ? ' invalid' : '')}
          onChange={this.props.onChange}
          onBlur={this.handleBlur}
          name={this.props.name}
          />
      </label>,
      <span key="hint" className="hint-text">{ errors[0] }</span>
    ];
  }
}

export default Field;