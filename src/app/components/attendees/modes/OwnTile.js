import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "@voxeet/react-redux-5.1.1";

import TileVideo from "./TileVideo";
import TileLegend from "./TileLegend";

@connect(store => {
  return {
    inputManager: store.voxeet.inputManager
  };
})
class OwnTile extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const checker = document.getElementById(
      "video-" + this.props.nbParticipant + "-video-on"
    );
    if (
      (checker != null && nextProps.participant.stream == null) ||
      (checker != null && !nextProps.participant.stream.active) ||
      (checker != null && nextProps.participant.stream.getVideoTracks().length === 0) ||
      (checker == null && nextProps.participant.stream) ||
      (this.props.mySelf && this.props.participant.name == null)
    ) {
      return true;
    }
    return false;
  }

  render() {
    const {
      participant,
      toggleMicrophone,
      isWidgetFullScreenOn,
      isAdmin,
      kickParticipant,
      isAdminActived,
      nbParticipant,
      mySelf,
      dolbyVoiceEnabled
    } = this.props;
    const { currentVideoDevice } = this.props.inputManager;
    let backCamera = true;

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then(function (sources) {
          /* GET SOURCES */
          sources.forEach(source => {
            if (source.kind === "videoinput" && source.deviceId == currentVideoDevice) {
                console.log(source)
                if (source.facingMode == "environment" || source.label.indexOf("facing back") >= 0) {
                  backCamera = true;
                }
            }
          })
        })
    }

    return (
      <div
        className={
          "tile-item " +
          (participant.isConnected
            ? "participant-available"
            : "participant-offline")
        }
        id={
          "video-" +
          nbParticipant +
          "-video-" +
          (participant.stream &&
          participant.stream.active &&
          participant.stream.getVideoTracks().length > 0
            ? "on"
            : "off")
        }
      >
        <TileVideo
          isBackCamera={backCamera}
          mySelf={mySelf}
          kickParticipant={kickParticipant}
          isAdminActived={isAdminActived}
          isAdmin={isAdmin}
          participant={participant}
          toggleMicrophone={toggleMicrophone}
          isWidgetFullScreenOn={isWidgetFullScreenOn}
          dolbyVoiceEnabled={dolbyVoiceEnabled}
        />
        <TileLegend
          participant={participant}
          kickParticipant={kickParticipant}
          isAdminActived={isAdminActived}
          isAdmin={isAdmin}
          toggleMicrophone={toggleMicrophone}
          dolbyVoiceEnabled={dolbyVoiceEnabled}
        />
      </div>
    );
  }
}

OwnTile.defaultProps = {
  mySelf: false,
};

OwnTile.propTypes = {
  participant: PropTypes.object.isRequired,
  toggleMicrophone: PropTypes.func.isRequired,
  isWidgetFullScreenOn: PropTypes.bool.isRequired,
  kickParticipant: PropTypes.func.isRequired,
  mySelf: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  nbParticipant: PropTypes.number,
  dolbyVoiceEnabled: PropTypes.bool,
};

export default OwnTile;
