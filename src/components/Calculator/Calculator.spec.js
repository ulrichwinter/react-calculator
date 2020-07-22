import React from 'react';
import { shallow, mount } from 'enzyme';
import Calculator from './Calculator';
import Display from '../Display/Display';
import Keypad from '../Keypad/Keypad';

describe('Calculator', () => {
    let wrapper;

    beforeEach(() => wrapper = shallow(<Calculator />));

    it('should render correctly', () => expect(wrapper).toMatchSnapshot());

    it('should render a <div />', () => {
        expect(wrapper.find('div').length).toEqual(1);
    });

    it('should render the Display and Keypad components', () => {
        expect(wrapper.containsAllMatchingElements([
            <Display displayValue={wrapper.instance().state.displayValue} />,
            <Keypad 
                callOperator={wrapper.instance().callOperator}
                numbers={wrapper.instance().state.numbers}
                operators={wrapper.instance().state.operators}
                setOperator={wrapper.instance().setOperator}
                updateDisplay={wrapper.instance().updateDisplay}
            />
        ])).toEqual(true);
    })
});

describe('mounted Calculator', () => {
    let wrapper;

    beforeEach(() => wrapper = mount(<Calculator />));

    it('calls updateDisplay when a number key is clicked', () => {
        const spy = jest.spyOn(wrapper.instance(), 'updateDisplay');        
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalledTimes(0);

        wrapper.find('.number-key').first().simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toBeCalledWith(expect.stringMatching(/[0-9]/));
        
    });

    it('calls setOperator when an operator key is clicked', () => {
        const spy = jest.spyOn(wrapper.instance(), 'setOperator');
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalledTimes(0);

        wrapper.find('.operator-key').first().simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toBeCalledWith(expect.stringMatching(/[/x\-+]/));
    });

    it('calls callOperator when the submit key is clicked', () => {
        const spy = jest.spyOn(wrapper.instance(), 'callOperator');
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalledTimes(0);

        wrapper.find('.submit-key').first().simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
    });

});

describe('updateDisplay', () => {
    let wrapper;

    beforeEach(() => wrapper=shallow(<Calculator />));

    it('updates displayValue', () => {
        wrapper.instance().updateDisplay('5');
        expect(wrapper.state('displayValue')).toEqual('5');
    });
    it('concatenates displayValue', () => {
        wrapper.instance().updateDisplay('5');
        wrapper.instance().updateDisplay('0');
        expect(wrapper.state('displayValue')).toEqual('50');
    })
    it('ignores additional leading 0s', () => {
        expect(wrapper.state('displayValue')).toEqual('0');
        wrapper.instance().updateDisplay('0');
        expect(wrapper.state('displayValue')).toEqual('0');
        wrapper.instance().updateDisplay('0');
        expect(wrapper.state('displayValue')).toEqual('0');
        wrapper.instance().updateDisplay('5');
        expect(wrapper.state('displayValue')).toEqual('5');
        wrapper.instance().updateDisplay('0');
        expect(wrapper.state('displayValue')).toEqual('50');
        wrapper.instance().updateDisplay('0');
        expect(wrapper.state('displayValue')).toEqual('500');
    });
    it('lets remove last char with ce', () => {
        wrapper.instance().updateDisplay('5');
        wrapper.instance().updateDisplay('5');
        wrapper.instance().updateDisplay('ce');
        expect(wrapper.state('displayValue')).toEqual('5');
    });
    it('ce replaces single digit with 0', () => {
        wrapper.instance().updateDisplay('5');
        wrapper.instance().updateDisplay('ce');
        expect(wrapper.state('displayValue')).toEqual('0');

    });
    it('ce leads at least to 0 instead of empty', () => {
        wrapper.instance().updateDisplay('ce');
        expect(wrapper.state('displayValue')).toEqual('0');
    });
    it('avoids multiple occurances of .', () => {
        wrapper.instance().updateDisplay('4');
        wrapper.instance().updateDisplay('.');
        expect(wrapper.state('displayValue')).toEqual('4.');
        wrapper.instance().updateDisplay('5');
        wrapper.instance().updateDisplay('.');
        expect(wrapper.state('displayValue')).toEqual('4.5');
        wrapper.instance().updateDisplay('3');
        expect(wrapper.state('displayValue')).toEqual('4.53');
    });
    it('adds trailing 0 before .', () => {
        wrapper.instance().updateDisplay('.');
        expect(wrapper.state('displayValue')).toEqual('0.');
    });
});

describe('setOperator', () => {
    let wrapper;

    beforeEach(() => wrapper=shallow(<Calculator />));

    it('updates the value of selectedOperator', () => {
        wrapper.instance().setOperator('+');
        expect(wrapper.state('selectedOperator')).toEqual('+');
        wrapper.instance().setOperator('/');
        expect(wrapper.state('selectedOperator')).toEqual('/');
    }); 
    it('updates the value of storedValue to the value of displayValue', () => {
        wrapper.setState({displayValue: '123'});
        wrapper.instance().setOperator('+');
        expect(wrapper.state('storedValue')).toEqual('123');
    });
    it('updates the value of displayValue to 0', () => {
        wrapper.setState({displayValue: '123'});
        wrapper.instance().setOperator('+');
        expect(wrapper.state('displayValue')).toEqual('0');
    });
    it('does only update selectedOperator and not the values, if selectedOperator was not empty', () => {
        wrapper.setState({displayValue: '123'});
        wrapper.instance().setOperator('+');
        wrapper.instance().setOperator('*');
        
        expect(wrapper.state('selectedOperator')).toEqual('*');
        expect(wrapper.state('displayValue')).toEqual('0');
        expect(wrapper.state('storedValue')).toEqual('123');
    });
});