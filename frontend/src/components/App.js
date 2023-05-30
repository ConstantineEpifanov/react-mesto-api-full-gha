import { useState, useEffect } from "react";
import "../page/index.css";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { auth } from "../utils/auth";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoToolTip";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isFailPopupOpen, setFailPopupOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);

  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  function handleLogin({ email, password }) {
    auth
      .login({ email, password })
      .then((data) => {
        localStorage.setItem("token", data.token);
        setEmail(email);
        setLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch(console.log);
  }

  function handleRegister({ email, password }) {
    auth
      .register({ email, password })
      .then(() => {
        setSuccessPopupOpen(true);
      })
      .catch(() => {
        setFailPopupOpen(true);
      });
  }

  function handleSignout() {
    setLoggedIn(false);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setLoggedIn(true);
          navigate("/", { replace: true });
        })
        .catch(console.log);
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, cardData]) => {
          setCurrentUser(userInfo);
          setCards(cardData);
        })
        .catch(console.log);
    }
  }, [loggedIn]);

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard({});
    setSuccessPopupOpen(false);
    setFailPopupOpen(false);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(cardId) {
    api
      .putLike(cardId)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((card) => (card._id === cardId ? newCard : card))
        );
      })
      .catch(console.log);
  }

  function handleCardDislike(cardId) {
    api
      .deleteLike(cardId)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((card) => (card._id === cardId ? newCard : card))
        );
      })
      .catch(console.log);
  }

  function handleCardDelete(cardId) {
    api
      .deleteCard(cardId)
      .then(() => {
        setCards((cards) => cards.filter((card) => card._id !== cardId));
      })
      .catch(console.log);
  }

  function handleUpdateUser({ name, about }) {
    api
      .patchUserInfo({ name, about })
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(console.log);
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .patchAvatar({ avatar })
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(console.log);
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .postCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.log);
  }
  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={email} onLogOut={handleSignout} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
              
                loggedIn={loggedIn}
                component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardDelete={handleCardDelete}
                onCardLike={handleCardLike}
                onCardDislike={handleCardDislike}
                cards={cards}
              />
            }
          />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
        </Routes>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          name="submit"
          title="Вы уверены?"
          submitButtonText="Да"></PopupWithForm>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          isOpen={isSuccessPopupOpen}
          onClose={() => {
            closeAllPopups();
            navigate("/", { replace: true });
          }}
          isAccept={true}
          infoText="Вы успешно зарегистрировались!"
        />
        <InfoTooltip
          isOpen={isFailPopupOpen}
          onClose={closeAllPopups}
          isAccept={false}
          infoText="Что-то пошло не так! Попробуйте ещё раз."
        />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
