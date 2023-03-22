import { Add } from "@mui/icons-material";
import { Avatar, AvatarGroup, Divider, Tooltip } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";

import PropTypes from 'prop-types'

const GroupMembers = ({ members }) => {

  return (
    <SoftBox display="flex">
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography align="center" component="p" variant="caption" fontWeight="medium" mb={1} color="text">
          Administradores de Eventos:
        </SoftTypography>
        <AvatarGroup
          componentsProps={{
            additionalAvatar: {
              component: (args) => {
                const hiddenMembersNames = members.slice(args.children[1]).map(member => member.name).join(', ');
                return (
                  <Tooltip title={hiddenMembersNames} placement="top" children={<Avatar {...args} />} />
                )
              },
              sx: {
                cursor: 'pointer',
                '&:focus, &:hover': {
                  zIndex: "10",
                }
              }
            }
          }}
        >
          {
            members.map(({ image, name }) => (
              <Tooltip key={name} title={name} placement="top">
                <Avatar
                  src={image}
                  alt={name}
                  sx={{
                    cursor: 'pointer',
                    '&:focus, &:hover': {
                      zIndex: "10",
                    }
                  }}
                />
              </Tooltip>
            ))
          }
        </AvatarGroup>
      </SoftBox>
      <SoftBox>
        <Divider orientation="vertical" variant="middle" />
      </SoftBox>
      <SoftBox display="flex" justifyContent="center" alignItems="center">
        <Tooltip title="Agregar Administrador" placement="top">
          <SoftButton variant="outlined" color="dark" iconOnly>
            <Add />
          </SoftButton>
        </Tooltip>
      </SoftBox>
    </SoftBox>

  )
}

GroupMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object)
}

export default GroupMembers;