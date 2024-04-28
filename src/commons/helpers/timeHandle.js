"use strict";

const isTokenExpired = ({ exp }) => {
  const now = new Date();
  return exp < now.getTime() / 1000;
};

module.exports = { isTokenExpired };
