// React
import { useCallback, useMemo, useState } from "react";

// MUI
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

// Components
import SoftBadge from "components/SoftBadge";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import AnnouncementCard from "examples/Cards/AnnouncementCard";

// Libraries
import PropTypes from "prop-types"


const AnnouncementGroup = ({ announcements }) => {
  const [announcement, setAnnouncement] = useState(announcements[0]);

  const currentAnnouncementIdx = useMemo(() => announcements.findIndex(child => child.id === announcement.id), [announcement.id, announcements])

  const skipLeft = useCallback(e => {
    if (currentAnnouncementIdx - 1 < 0) return;
    return setAnnouncement(announcements[currentAnnouncementIdx - 1]);
  }, [announcements, currentAnnouncementIdx]);

  const skipRight = useCallback(e => {
    if (currentAnnouncementIdx + 1 >= announcements.length) return;
    return setAnnouncement(announcements[currentAnnouncementIdx + 1]);
  }, [announcements, currentAnnouncementIdx]);

  return (
    <SoftBox sx={{ position: "relative" }}>
      <SoftBadge
        badgeContent={`${currentAnnouncementIdx + 1} de ${announcements?.length}`}
        color="secondary"
        variant="contained"
        container
        sx={{
          position: "absolute",
          right: 95,
          top: 21
        }}
      />
      <AnnouncementCard {...announcement} />
      <SoftBox
        sx={{
          position: "absolute",
          right: 0,
          top: -20,
        }}
      >
        <SoftButton
          iconOnly
          circular
          variant="gradient"
          size="small"
          color="light"
          onClick={skipLeft}
        >
          <ChevronLeft />
        </SoftButton>
        <SoftButton
          iconOnly
          circular
          variant="gradient"
          size="small"
          color="light"
          onClick={skipRight}
          sx={{ ml: 1 }}
        >
          <ChevronRight />
        </SoftButton>
      </SoftBox>
    </SoftBox>
  )
}

AnnouncementGroup.defaultProps = {
  announcements: [],
}

AnnouncementGroup.propTypes = {
  announcements: PropTypes.array
}


export default AnnouncementGroup;