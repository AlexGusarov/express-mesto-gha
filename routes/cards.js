const express = require('express');
const router = express.Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards')

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);

module.exports = router;
