
import React from 'react';
import './EllipsisAnimation.css';

export default class EllipsisAnimation extends React.Component {
    render() {
        return (
            <div className="loading"> 
                {this.props.children}
            </div>

        );
    }
}
