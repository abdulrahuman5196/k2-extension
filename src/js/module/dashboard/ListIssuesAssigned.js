import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import * as Issues from '../../lib/actions/Issues';
import PanelIssues from '../../component/panel/PanelIssues';
import ONYXKEYS from '../../ONYXKEYS';
import IssuePropTypes from '../../component/list-item/IssuePropTypes';

const propTypes = {
    /** The number of milliseconds to refresh the data */
    pollInterval: PropTypes.number.isRequired,

    /** All the GH issues assigned to the current user */
    issues: PropTypes.objectOf(IssuePropTypes),
};
const defaultProps = {
    issues: null,
};

class ListIssuesAssigned extends React.Component {
    constructor(props) {
        super(props);

        this.fetch = this.fetch.bind(this);
    }

    componentDidMount() {
        this.fetch();

        if (this.props.pollInterval && !this.interval) {
            this.interval = setInterval(this.fetch, this.props.pollInterval);
        }
    }

    componentWillUnmount() {
        if (!this.interval) {
            return;
        }
        clearInterval(this.interval);
    }

    fetch() {
        Issues.getAllAssigned();
    }

    render() {
        if (!this.props.issues) {
            return (
                <div className="blankslate capped clean-background">
                    Loading
                </div>
            );
        }

        if (!_.size(this.props.issues)) {
            return (
                <div className="blankslate capped clean-background">
                    No items
                </div>
            );
        }

        const paymentIssues = _.pick(this.props.issues, issue => _.findWhere(issue.labels, {name: 'Awaiting Payment'}));
        const underReviewIssues = _.pick(this.props.issues, issue => _.findWhere(issue.labels, {name: 'Reviewing'}));
        // const helpWantedIssues = _.pick(this.props.issues, issue => _.findWhere(issue.labels, {name: 'Help Wanted'}));
        const hourlyIssues = _.pick(this.props.issues, issue => _.findWhere(issue.labels, {name: 'Hourly'}));
        const monthlyIssues = _.pick(this.props.issues, issue => _.findWhere(issue.labels, {name: 'Monthly'}));
        const dailyIssues = _.pick(_.omit(this.props.issues, _.keys(paymentIssues).concat(_.keys(underReviewIssues))), issue => _.findWhere(issue.labels, {name: 'Daily'}));
        const weeklyIssues = _.pick(_.omit(this.props.issues, _.keys(paymentIssues).concat(_.keys(underReviewIssues))), issue => !paymentIssues[issue] && _.findWhere(issue.labels, {name: 'Weekly'}));

        return (
            <div className="mb-3">
                <div className="d-flex flex-row">
                    {_.size(hourlyIssues) > 0 && (
                    <div className="col-3 pr-4">
                        <PanelIssues
                            title="Hourly"
                            extraClass="hourly"
                            data={hourlyIssues}
                        />
                    </div>
                    )}
                    {_.size(dailyIssues) > 0 && (
                    <div className="col-3 pr-4">
                        <PanelIssues
                            title="Daily"
                            extraClass="daily"
                            data={dailyIssues}
                        />
                    </div>
                    )}
                    {_.size(weeklyIssues) > 0 && (
                    <div className="col-3 pr-4">
                        <PanelIssues
                            title="Weekly"
                            extraClass="weekly"
                            data={weeklyIssues}
                        />
                    </div>
                    )}
                    {_.size(monthlyIssues) > 0 && (
                    <div className="col-3 pr-4">
                        <PanelIssues
                            title="Monthly"
                            extraClass="monthly"
                            data={monthlyIssues}
                        />
                    </div>
                    )}
                    {_.size(paymentIssues) > 0 && (
                    <div className="col-3 pr-4">
                        <PanelIssues
                            title="Payment Issues"
                            extraClass="paymentIssues"
                            data={_.sortBy(paymentIssues, issue => new Date(issue.title.substring(18, 28)))}
                        />
                    </div>
                    )}
                    {_.size(underReviewIssues) > 0 && (
                    <div className="col-3 pr-4">
                        <PanelIssues
                            title="Under Review"
                            extraClass="paymentIssues"
                            data={underReviewIssues}
                        />
                    </div>
                    )}
                    {/* {_.size(helpWantedIssues) > 0 && (
                    <div className="col-3 pr-4">
                        <PanelIssues
                            title="Help Wanted"
                            extraClass="paymentIssues"
                            data={helpWantedIssues}
                        />
                    </div>
                    )} */}
                </div>
                <div className="pt-4">
                    <PanelIssues
                        title="No Priority"
                        extraClass="no-priority"
                        hideOnEmpty
                        // eslint-disable-next-line max-len
                        data={_.pick(this.props.issues, issue => _.intersection(_.map(issue.labels, label => label.name), ['Hourly', 'Daily', 'Weekly', 'Monthly']).length === 0)}
                    />
                </div>
            </div>
        );
    }
}

ListIssuesAssigned.propTypes = propTypes;
ListIssuesAssigned.defaultProps = defaultProps;

export default withOnyx({
    issues: {
        key: ONYXKEYS.ISSUES.ASSIGNED,
    },
})(ListIssuesAssigned);
