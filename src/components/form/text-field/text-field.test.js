/* globals describe beforeEach expect it jest */

import React from 'react';
import TestUtils from 'react-dom/test-utils';

import TextField from './text-field';

describe('<TextField />', function () {
  let root;
  let props;

  const textField = function () {
    if (!root) {
      root = TestUtils.renderIntoDocument(<TextField {...props} />);
    }

    return root;
  };

  beforeEach(() => {
    root = undefined;
    props = {
      name: undefined,
      onChange: undefined,
      validate: undefined
    };
  });

  it('should exist', function () {
    expect(TestUtils.isCompositeComponent(textField())).toBeTruthy();
  });

  it('always render a label and span', function () {
    const elems = TestUtils.findAllInRenderedTree(
      textField(),
      (c) => c.tagName === 'LABEL' || c.tagName === 'SPAN'
    ).slice(0, 2);

    expect(elems.length).toEqual(2);
  });

  describe('when `name` is defined', function () {
    beforeEach(() => {
      props.name = 'name';
    });

    it('sets the rendered DOM input\'s name props to the name prop\'s value', function () {
      const input = TestUtils.findRenderedDOMComponentWithTag(textField(), 'input');
      expect(input.getAttribute('name')).toMatch(/name/);
    });
  });

  describe('when `name` is undefined', function () {
    beforeEach(() => {
      props.name = null;
    });

    it('sets the rendered input\'s name prop to undefined', function () {
      const input = TestUtils.findRenderedDOMComponentWithTag(textField(), 'input');
      expect(input.getAttribute('name')).toBeNull();
    });
  });

  describe('when `onChange` is defined', function () {
    beforeEach(() => {
      props.onChange = jest.fn();
    });

    it('calls the onChange callback function when the user changes the value', function () {
      const input = TestUtils.findRenderedDOMComponentWithTag(textField(), 'input');
      input.value = 'fuck';
      TestUtils.Simulate.change(input);

      expect(props.onChange).toBeCalled();
    });
  });

  describe('when the TextField is required', function () {
    let input;
    
    beforeEach(() => {
      props.validate = ['required'];
      input = TestUtils.findRenderedDOMComponentWithClass(textField(), 'form-input');
    });

    describe('when the text field is empty', function () {
      beforeEach(() => {
        input.value = '';
        TestUtils.Simulate.blur(input);
      });

      it('adds invalid class to the DOM input', function () {  
        expect(input.className).toMatch(/invalid/);
      });

      it('adds errors to the TextField\'s state', function () {
        expect(textField().state.errors.length).toBeGreaterThan(0);
      });

      it('renders the errors in a hint span', function () {
        const span = TestUtils.findRenderedDOMComponentWithClass(textField(), 'hint-text');
        expect(span.textContent).toMatch(textField().state.errors[0]);
      });
    });

    describe('when the textField is not empty', function () {
      beforeEach(() => {
        input.value = 'some input';
        TestUtils.Simulate.blur(input);
      });

      it('removes invalid class from the DOM input', function () {
        expect(input.className).not.toMatch(/invalid/);
      });

      it('removes the errors from the component state', function () {
        expect(textField().state.errors.length).toEqual(0);
      });

      it('removes the errors from hint span', function () {
        const span = TestUtils.findRenderedDOMComponentWithClass(textField(), 'hint-text');
        expect(span.textContent.length).toEqual(0);
      });
    });

  });

  describe('when the textField is an email address', function () {
    let input;

    beforeEach(() => {
      props.validate = ['email'];
      input = TestUtils.findRenderedDOMComponentWithClass(textField(), 'form-input');
    });

    describe('when the input doesn\'t match an email format', function () {
      beforeEach(() => {
        input.value = 'invalid input';
        TestUtils.Simulate.blur(input);
      });

      it('adds `invalid` class to the DOM input', function () {
        expect(input.className).toMatch(/invalid/);
      });

      it('adds errors to the component state', function () {
        expect(textField().state.errors.length).toBeGreaterThan(0);
      });

      it('renders the errors in the a hint span', function () {
        const span = TestUtils.findRenderedDOMComponentWithClass(textField(), 'hint-text');

        expect(span.textContent).toMatch(textField().state.errors[0]);
      });
    });

    describe('when the input matchs an email format', function () {
      beforeEach(() => {
        input.value = 'email@address.com';
        TestUtils.Simulate.blur(input);
      });

      it('removes `invalid` class from the DOM input', function () {
        expect(input.className).not.toMatch(/invalid/);
      });

      it('removes errors from the component state', function () {
        expect(textField().state.errors.length).toEqual(0);
      });

      it('removes the errors from the a hint span', function () {
        const span = TestUtils.findRenderedDOMComponentWithClass(textField(), 'hint-text');
        expect(span.textContent.length).toEqual(0);
      });
    });
  });
});