import React from 'react'

export default class StepArrowComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (   
            <div className="btnArea">
                <div className="PNBtn">
                    <button type="button" className="prev">Prev</button>
                    <button type="button" className="next">Next</button>
                </div>
            </div>
        )
    }
}