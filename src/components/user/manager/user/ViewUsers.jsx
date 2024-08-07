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
import {useLanguage} from "../../../../contexts/language/language-context";

const ViewUsers = () => {
  const [page, setPage] = useState(1);
  const [users: UserManagementModel[], setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filters, setFilters] = useState({
    usernamePrompt: "",
    emailPrompt: "",
    telegramPrompt: "",
    roles: [],
    statuses: [],
    page: page,
  });
  const location = useLocation();
  const {language} = useLanguage();

  const toggleUser = (id) => {
    setSelectedUserId(id === selectedUserId ? null : id);
  };

  const getUsers = async () => {
    setUsers(await getUsersForManagementPanel(UserFilter.build(filters)));
  };

  useEffect(() => {
    filters.page = page
    const query: string = getQueryParam("option", location);
    if (!query || query === "" || query === "viewUser") {
      getUsers()
    }
  }, [page])

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
    setPage(1)
    setFilters({
      usernamePrompt: "",
      emailPrompt: "",
      telegramPrompt: "",
      roles: [],
      statuses: [],
      page: page,
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
      <Col md={4} className="position-sticky">
        <ListGroup>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>
              {
                 language === 'EN' ? 'Username: ' : 'Ім\'я користувача: '
              }
            </span>
            <input
              type="text"
              name="usernamePrompt"
              value={filters.usernamePrompt}
              className="form-control"
              placeholder={language === 'EN' ? 'Username' : 'Ім\'я користувача'}
              onChange={(e) => updateFilterUsername(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faQuestion}
              style={{ color: "orange", cursor: "pointer" }}
              onClick={() => {
                if (language === 'EN') {
                  notifySuccess("Your prompt is used as prefix to search usernames")
                } else {
                  notifySuccess('Ваш запит буде використано для пошуку користувача за префіксом імені')
                }
            }}
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
              onClick={() => {
                if (language === 'EN') {
                  notifySuccess("Your prompt is used as prefix to search email")
                } else {
                  notifySuccess('Ваш запит буде використано для поушку користувача за префіксом пошти')
                }
              }
              }
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
              onClick={() => {
                if (language === 'EN') {
                  notifySuccess("Your prompt is used as prefix to search telegram")
                } else {
                  notifySuccess('Ваш запит буде використано для поушку користувача за префіксом телеграму')
                }
              }
            }
            />
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center flex-wrap">
            <span>
              {
                language === 'EN' ? 'Status:' : 'Статус:'
              }
            </span>
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
            <span>
              {
                language === 'EN' ? 'Role:' : 'Роль:'
              }
            </span>
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
              id={"Manager"}
              label={"Manager"}
              value={"Manager"}
              checked={filters.roles.includes("ROLE_MANAGER")}
              onChange={() => updateFilterRoles("ROLE_MANAGER")}
            />
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between">
            <Button color="primary" onClick={getUsers}>
              {
                language === 'EN' ? 'Filter' : 'Відфільтрувати'
              }
            </Button>
            <Button color="primary" onClick={dropFilters}>
              {
                language === 'EN' ? 'Drop Filters' : 'Скинути фільтрацію'
              }
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
                    {
                      language === 'EN' ? 'Username: ' : 'Ім\'я: '
                    }
                    {user.username} | Status: {user.status} | Online:{" "}
                    {String(user.loginTime > user.logoutTime).toUpperCase()}
                  </span>
                  <FontAwesomeIcon icon={selectedUserId === user.id ? faAngleUp : faAngleDown} />
                </div>
              </CardHeader>
              <Collapse in={selectedUserId === user.id}>
                <CardBody>
                  <ListGroup>
                    <ListGroupItem>
                      {
                        language === 'EN' ? 'Username: ' : 'Ім\'я: '
                      }
                      {user.username}</ListGroupItem>
                    <ListGroupItem>Email: {user.email || "UNKNOWN"}</ListGroupItem>
                    <ListGroupItem>Telegram: {user.telegramUsername || "UNKNOWN"}</ListGroupItem>
                    <ListGroupItem>
                      {
                        language === 'EN' ? 'Last Log In Time: ' : 'Останній вхід: '
                      }
                      {user.loginTime}</ListGroupItem>
                    <ListGroupItem>
                      {
                        language === 'EN' ? 'Last Log Out Time: ' : 'Останній вихід з системи: '
                      }
                      {user.logoutTime}</ListGroupItem>
                    <ListGroupItem>
                      {
                        language === 'EN' ? 'Registered At: ' : 'Зареєстровано о: '
                      }
                      {user.creationTime}</ListGroupItem>
                    <ListGroupItem>
                      {
                        language === 'EN' ? 'User Role: ' : 'Роль користувача: '
                      }
                      {user.role}</ListGroupItem>
                    <ListGroupItem>
                      {
                        language === 'EN' ? 'User Status: ' : 'Статус користувача: '
                      }
                      {user.status}
                    </ListGroupItem>
                    <ListGroupItem>
                      {
                        language === 'EN' ? 'User Timezone: ' : 'Таймзона: '
                      }
                      {user.timezone}
                    </ListGroupItem>
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
            <h1 className="font-monospace my-3">
              {
                language === 'EN' ? 'No users...' : 'Немає користувачів'
              }
            </h1>
            <h3 onClick={() => redirectToUI()} className="text-decoration-underline" style={{ cursor: "pointer" }}>
              {
                language === 'EN' ? 'Go to main' : 'Відкрити головну сторінку'
              }
            </h3>
          </div>
        )}
        <div className="w-100 d-flex justify-content-center align-items-center">
          <Button
              className="mx-3"
              style={{ width: "100px" }}
              disabled={page <= 1}
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
          >
            Prev
          </Button>
          <h3 className="font-monospace">{page}</h3>
          <Button
              className="mx-3"
              style={{ width: "100px" }}
              onClick={() => {
                if (users?.length > 0) {
                  setPage(page + 1);
                }
              }}
          >
            Next
          </Button>
        </div>
      </Col>
    </div>
  );
};

export default ViewUsers;
