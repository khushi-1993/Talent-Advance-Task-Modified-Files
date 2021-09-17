import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Grid } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData;
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");

        this.state = {
            loadNumber: 5,
            loadPosition: 850,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: {},
            talents: []
        }

        this.init = this.init.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadCompanyDetails = this.loadCompanyDetails.bind(this);
        this.loadFeed = this.loadFeed.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.renderTalents = this.renderTalents.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });
    }

    loadData() {
        this.loadCompanyDetails();
        this.loadFeed();
        this.init()
    }

    updateWithoutSave(newData) {
        let newCD = Object.assign({}, this.state.companyDetails, newData)
        this.setState({
            companyDetails: newCD
        })
    }

    componentDidMount() {
        this.loadData()
        window.addEventListener('scroll', this.handleScroll);
    };

    loadCompanyDetails()
    {
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: 'http://localhost:60290/profile/profile/GetEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                this.updateWithoutSave(res.employer.companyContact)
            }.bind(this)
        })
    }

    loadFeed() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalentList',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
             data: { position: this.state.loadPosition, number: this.state.loadNumber},
            success: function (res) {
                let newFeedData = this.state.feedData;
                let newLoadPosition = this.state.loadPosition;
                if (res.data) {
                    newFeedData = newFeedData.concat(res.data);
                    newLoadPosition += this.state.loadNumber;
                }
                this.setState({
                    feedData: newFeedData,
                    loadPosition: newLoadPosition
                });
            }.bind(this)
        })
    }

    handleScroll() {
        const win = $(window);
        if ((($(document).height() - win.height()) == Math.round(win.scrollTop())) || ($(document).height() - win.height()) - Math.round(win.scrollTop()) == 1) {
            $("#load-more-loading").show();
            this.loadFeed();
        }
        $("#load-more-loading").hide();
    };

    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile companyDetails={this.state.companyDetails} />
                    </div>
                    <div className="eight wide column">
                    {this.renderTalents()}
                                    <p id="load-more-loading">
                                        <img src="/images/rolling.gif" alt="Loading…" />
                                    </p>
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }

    renderTalents() {
        const { feedData } = this.state;
        return (feedData && feedData.length > 0)
            ? <TalentCard talentData={feedData} />
            : <b>There are no talents found for your recruitment company</b>
    }
}