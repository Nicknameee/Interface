import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  FormCheck,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { notifySuccess } from "../../../../utilities/notify";
import { UserManagementModel } from "../../../../schemas/responses/models/UserManagementModel.ts";
import { getQueryParam, getUsersForManagementPanel, updateUser } from "../../../../index";
import { redirectToUI } from "../../../../utilities/redirect";
import React, { useEffect, useState } from "react";
import { UserFilter } from "../../../../schemas/requests/filters/UserFilter.ts";
import { useLocation } from "react-router-dom";

const ViewUsers = () => {
  const [users: UserManagementModel[], setUsers] = useState([]);
  const [usersPage: number, setUsersPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filters, setFilters] = useState({
    usernamePrompt: "",
    emailPrompt: "",
    telegramPrompt: "",
    roles: [],
    statuses: [],
    page: usersPage,
  });
  const location = useLocation();

  const toggleUser = (id) => {
    setSelectedUserId(id === selectedUserId ? null : id);
  };

  const getUsers = async () => {
    setUsers(await getUsersForManagementPanel(UserFilter.build(filters)));
  };

  const updateFilterStatus = (status) => {
    if (filters.statuses.includes(status)) {
      setFilters({
        ...filters,
        statuses: filters.statuses.filter((s) => s !== status),
      });
    } else {
      setFilters({
        ...filters,
        statuses: [...filters.statuses, status],
      });
    }
  };

  const updateFilterRoles = (role) => {
    if (filters.roles.includes(role)) {
      setFilters({
        ...filters,
        roles: filters.roles.filter((s) => s !== role),
      });
    } else {
      setFilters({
        ...filters,
        roles: [...filters.roles, role],
      });
    }
  };

  const updateFilterUsername = (value) => {
    setFilters({
      ...filters,
      usernamePrompt: value,
    });
  };

  const updateFilterEmail = (value) => {
    setFilters({
      ...filters,
      emailPrompt: value,
    });
  };

  const updateFilterTelegram = (value) => {
    setFilters({
      ...filters,
      telegramPrompt: value,
    });
  };

  const dropFilters = () => {
    setFilters({
      usernamePrompt: "",
      emailPrompt: "",
      telegramPrompt: "",
      roles: [],
      statuses: [],
      page: usersPage,
    });
  };

  useEffect(() => {
    const query: string = getQueryParam("option", location);

    const init = async () => {
      getUsers();
    };

    if (!query || query === "" || query === "viewUser") {
      init().then((r) => {});
    }
  }, [location]);

  return (
    <div className="w-100 h-100 d-flex justify-content-around py-3">
      <Col md={3} className="position-sticky">
        <ListGroup>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>Username:</span>
            <input
              type="text"
              name="usernamePrompt"
              value={filters.usernamePrompt}
              className="form-control"
              placeholder="Username"
              onChange={(e) => updateFilterUsername(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faQuestion}
              style={{ color: "orange", cursor: "pointer" }}
              onClick={() => notifySuccess("Your prompt is used as prefix to search usernames")}
            />
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>Email:</span>
            <input
              type="text"
              name="emailPrompt"
              value={filters.emailPrompt}
              className="form-control"
              placeholder="Email"
              onChange={(e) => updateFilterEmail(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faQuestion}
              style={{ color: "orange", cursor: "pointer" }}
              onClick={() => notifySuccess("Your prompt is used as prefix to search email")}
            />
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>Telegram:</span>
            <input
              type="text"
              name="telegramPrompt"
              value={filters.telegramPrompt}
              className="form-control"
              placeholder="Telegram"
              onChange={(e) => updateFilterTelegram(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faQuestion}
              style={{ color: "orange", cursor: "pointer" }}
              onClick={() => notifySuccess("Your prompt is used as prefix to search telegram")}
            />
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center flex-wrap">
            <span>Status:</span>
            <FormCheck
              className="w-100"
              key={crypto.randomUUID()}
              id={"ENABLED"}
              label={"ENABLED"}
              value={"ENABLED"}
              checked={filters.statuses.includes("ENABLED")}
              onChange={() => updateFilterStatus("ENABLED")}
            />
            <FormCheck
              className="w-100"
              key={crypto.randomUUID()}
              id={"DISABLED"}
              label={"DISABLED"}
              value={"DISABLED"}
              checked={filters.statuses.includes("DISABLED")}
              onChange={() => updateFilterStatus("DISABLED")}
            />
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center flex-wrap">
            <span>Role:</span>
            <FormCheck
              className="w-100"
              key={crypto.randomUUID()}
              id={"Customer"}
              label={"Customer"}
              value={"Customer"}
              checked={filters.roles.includes("ROLE_CUSTOMER")}
              onChange={() => updateFilterRoles("ROLE_CUSTOMER")}
            />
            <FormCheck
              className="w-100"
              key={crypto.randomUUID()}
              id={"Operator"}
              label={"Operator"}
              value={"Operator"}
              checked={filters.roles.includes("ROLE_OPERATOR")}
              onChange={() => updateFilterRoles("ROLE_OPERATOR")}
            />
            <FormCheck
              className="w-100"
              key={crypto.randomUUID()}
              id={"Manager"}
              label={"Manager"}
              value={"Manager"}
              checked={filters.roles.includes("ROLE_MANAGER")}
              onChange={() => updateFilterRoles("ROLE_MANAGER")}
            />
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between">
            <Button color="primary" onClick={getUsers}>
              Filter
            </Button>
            <Button color="primary" onClick={dropFilters}>
              Drop Filters
            </Button>
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col md={6}>
        {users && users.length > 0 ? (
          users.map((user: UserManagementModel) => (
            <Card className="mb-3 w-100" key={crypto.randomUUID()}>
              <CardHeader onClick={() => toggleUser(user.id)} style={{ cursor: "pointer" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    Username: {user.username} | Status: {user.status} | Online:{" "}
                    {String(user.loginTime > user.logoutTime).toUpperCase()}
                  </span>
                  <FontAwesomeIcon icon={selectedUserId === user.id ? faAngleUp : faAngleDown} />
                </div>
              </CardHeader>
              <Collapse in={selectedUserId === user.id}>
                <CardBody>
                  <ListGroup>
                    <ListGroupItem>Username: {user.username}</ListGroupItem>
                    <ListGroupItem>Email: {user.email || "UNKNOWN"}</ListGroupItem>
                    <ListGroupItem>Telegram: {user.telegramUsername || "UNKNOWN"}</ListGroupItem>
                    <ListGroupItem>Last Log In Time: {user.loginTime}</ListGroupItem>
                    <ListGroupItem>Last Log Out Time: {user.logoutTime}</ListGroupItem>
                    <ListGroupItem>Registered At: {user.creationTime}</ListGroupItem>
                    <ListGroupItem>User Role: {user.role}</ListGroupItem>
                    <ListGroupItem>User Status: {user.status}</ListGroupItem>
                    <ListGroupItem>User Timezone: {user.timezone}</ListGroupItem>
                  </ListGroup>
                  <Button
                    onClick={() =>
                      updateUser({ status: user.status === "ENABLED" ? "DISABLED" : "ENABLED", id: user.id })
                    }
                    className="my-1"
                  >
                    {user.status === "ENABLED" ? "Disable User" : "Enable User"}
                  </Button>
                </CardBody>
              </Collapse>
            </Card>
          ))
        ) : (
          <div>
            <h1 className="font-monospace my-3">No users...</h1>
            <h3 onClick={() => redirectToUI()} className="text-decoration-underline" style={{ cursor: "pointer" }}>
              Go to main
            </h3>
          </div>
        )}
      </Col>
    </div>
  );
};

export default ViewUsers;
