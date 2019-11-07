module.exports.execute = res => {
  return [
    { key: "ok", fn: queryRes => queryRes.serverStatus === 2 },
    {
      key: "insertId",
      fn: queryRes =>
        queryRes.insertId !== undefined ? queryRes.insertId : null
    },
    {
      key: "changedRows",
      fn: queryRes => (queryRes.changedRows !== 0 ? queryRes.changedRows : null)
    },
    {
      key: "affectedRows",
      fn: queryRes =>
        queryRes.affectedRows !== 0 ? queryRes.affectedRows : null
    }
  ].reduce((acc, field) => {
    const fieldRes = field.fn(res);
    if (fieldRes !== null) {
      acc[field.key] = fieldRes;
    }
    return acc;
  }, {});
};

module.exports.getFirst = res => {
  return res.length ? res[0] : false;
};

module.exports.get = res => {
  // remove the RowDataPacket object def
  return res.map(row => {
    return { ...row };
  });
};
