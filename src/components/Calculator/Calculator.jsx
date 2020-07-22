import React, {Component} from 'react';
import './Calculator.css';
import Display from '../Display/Display';
import Keypad from '../Keypad/Keypad';

class Calculator extends Component {
    state = {
        displayValue: '0',
        numbers: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '.', '0', 'ce'],
        operators: ['/', 'x', '-', '+'],
        selectedOperator: '',
        storedValue: '',
    }
    callOperator = () => {
        console.log('call operator');
    }

    setOperator = (operator) => {
        let {selectedOperator, storedValue, displayValue} = this.state;

        if(selectedOperator === '') {
            storedValue = displayValue;
            displayValue = '0';
        }
        selectedOperator = operator;
        
        this.setState({selectedOperator, storedValue, displayValue});
    }

    updateDisplay = (value) => {
        let {displayValue} = this.state;
        
        if (value === 'ce') {
            displayValue = displayValue.substr(0, displayValue.length-1);
        } else if(value === '.') {
            if(displayValue.indexOf('.') < 0) {
                displayValue = displayValue + value;
            }
        } else if(displayValue !== '0') {
            displayValue = displayValue + value;
        } else {
            displayValue = value;
        }

        if(displayValue.length === 0) {
            displayValue = '0';
        }   

        this.setState({displayValue});
    }

    render = () => {
        const {displayValue, numbers, operators} = this.state; 
        return (
            <div className="calculator-container">
                <Display displayValue={displayValue}/>
                <Keypad 
                    numbers={numbers}
                    operators={operators}
                    callOperator={this.callOperator}
                    setOperator={this.setOperator}
                    updateDisplay={this.updateDisplay}
                />
            </div>
        );
    }
}

export default Calculator;