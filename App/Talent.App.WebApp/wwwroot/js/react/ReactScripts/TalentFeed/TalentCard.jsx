import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon } from 'semantic-ui-react'
import TalentCardDetail from '../TalentFeed/TalentCardDetail.jsx';

export default class TalentCard extends React.Component {

    constructor(props) {
        super(props);
        this.getTalentCards = this.getTalentCards.bind(this);
    };

    getTalentCards() {
        let talents = this.props.talentData;
        let talentCards = [];
        if (talents != '' && talents != undefined) {
            talentCards = talents.map((t, index) => <TalentCardDetail talent={t} key={index} />)
        }
        return talentCards;
    }
    render() {
        let talentCards = this.getTalentCards();
        return (
            <React.Fragment>
                {talentCards}
            </React.Fragment>
        )
    }
}