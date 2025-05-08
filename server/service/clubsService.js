const { pool } = require("../database");
const {
  SELECT_ALL_CLUBS,
  SELECT_CLUB_BY_ID,
  SELECT_TOP_CLUBS,
  INSERT_CLUB,
  getAddOrUpdateClubQuery,
  DELETE_CLUB
} = require("./queries");

const getAllClubs = (req, res) => {
  pool.query(SELECT_ALL_CLUBS, (err, results) => {
    if (err) return res.status(500).send({ message: "Error while reading all clubs", error: err });
    res.status(200).send(results.rows);
  });
};

const getClubById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(SELECT_CLUB_BY_ID, [id], (err, results) => {
    if (err || results.rows.length === 0) return res.status(404).send({ message: "Klubi ei leitud", error: err });
    res.status(200).send(results.rows[0]);
  });
};

const getTopClubs = (req, res) => {
  const limit = parseInt(req.params.limit);
  pool.query(SELECT_TOP_CLUBS, [limit], (err, results) => {
    if (err) return res.status(500).send({ message: "Error while reading top clubs", error: err });
    res.status(200).send(results.rows);
  });
};

const addClub = (req, res) => {
  const { name, location, isUpdate, clubId } = req.body;
  const update = JSON.parse(isUpdate);
  const query = getAddOrUpdateClubQuery(update);
  const values = update ? [name, location, clubId] : [name, location];
  pool.query(query, values, (err, results) => {
    if (err) return res.status(500).send({ message: "Error while adding club", error: err });
    res.status(200).send(results.rows[0]);
  });
};

const deleteClub = (req, res) => {
  const clubId = parseInt(req.params.clubId);
  pool.query(DELETE_CLUB, [clubId], (err, results) => {
    if (err) return res.status(500).send({ message: `Error while deleting club(id=${clubId})`, error: err });
    res.status(200).send(results.rows);
  });
};

const getTopPlayersByClubId = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM f_klubiparimad_id($1)", [id], (err, result) => {
    if (err) return res.status(500).send({ message: "Parimaid mängijaid ei leitud", error: err });
    res.status(200).send(result.rows);
  });
};

module.exports = {
  getAllClubs,
  getClubById,
  addClub,
  getTopClubs,
  deleteClub,
  getTopPlayersByClubId
};
