import React from 'react';
import DEMO  from './../../../../../store/constant';
import Aux from "../../../../../hoc/_Aux";

const navLogo = (props) => {
    let toggleClass = ['mobile-menu'];
    if (props.collapseMenu) {
        toggleClass = [...toggleClass, 'on'];
    }

    return (
        <Aux>
            <div className="navbar-brand header-logo">
                <a href={DEMO.BLANK_LINK} className="b-brand">
                    <div className="b-bg">
                        <i className="feather icon-trending-up" />
                    </div>
                    <span className="b-title" style={{ "color": "rgb(247, 4, 118)" }}>deep</span><span className="b-title" style={{ "color": "rgb(234, 133, 7)", "marginLeft": "0px" }}>dive</span>
                </a>
                <a href={DEMO.BLANK_LINK} className={toggleClass.join(' ')} id="mobile-collapse" onClick={props.onToggleNavigation}><span /></a>
            </div>
        </Aux>
    );
};

export default navLogo;
