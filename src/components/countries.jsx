import React, { Component, useEffect, useState } from 'react';
import Fetch from '../helper/fetch';
class Countries extends Component {
    state = { 
        data: [],
        loading: true
    }
    render() {
        return (
            <div>
                <Fetch />
            </div>
        );
    }

}

export default Countries;

