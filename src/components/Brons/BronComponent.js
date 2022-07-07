import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DateAdapter from "@mui/lab/AdapterMoment";
import { deleteBron, getBrons } from "../../redux/actions/bronActions";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { LocalizationProvider } from "@mui/lab";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const BronComponent = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrons());
  }, [dispatch]);

  const brons = useSelector((state) => state.allBrons.brons);

  useEffect(() => {
    if (brons.length) {
      setSubjectBrons(brons);
    }
  }, [brons]);

  const handleDeleted = (id) => {
    if (window.confirm("Are you sure wanted to delete the bron")) {
      dispatch(deleteBron(id));
    }
  };

  const [subjectBrons, setSubjectBrons] = useState([]);
  const [filter, setFilter] = useState({
    price: null,
    startDate: null,
    endDate: null,
  });

  const handleChangeStartDate = (value) => {
    setFilter((prev) => ({ ...prev, startDate: value }));
  };

  const handleChangeEndDate = (value) => {
    setFilter((prev) => ({ ...prev, endDate: value }));
  };

  const handlePriceChange = (e) => {
    setFilter((prev) => ({ ...prev, price: e.target.value }));
  };

  const handleClearFilter = () => {
    setFilter({
      price: null,
      startDate: null,
      endDate: null,
    });
    setSubjectBrons(brons);
  };

  const handleFilter = () => {
    if (brons.length) {
      let filtered = brons.filter((item) =>
      (filter.amount != null ? item.amount == filter.amount : true) &&
        filter.startDate == null
          ? true
          : moment(item.startDate)
              .startOf("D")
              .isSame(moment(filter.startDate).startOf("D")) &&
            filter.startDate == null
          ? true
          : moment(item.endDate)
              .endOf("D")
              .isSame(moment(filter.endDate).endOf("D")) 
      );
      setSubjectBrons(filtered);
    }
  };

  return (
    <>
      <div className="filter">
      <TextField
          onChange={handlePriceChange}
          label="Enter bron Price"
          variant="outlined"
        />
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DesktopDatePicker
            label="Select Start date"
            inputFormat="MM/DD/yyyy"
            value={filter.startDate}
            onChange={handleChangeStartDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="Select End date"
            inputFormat="MM/DD/yyyy"
            value={filter.endDate}
            onChange={handleChangeEndDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button onClick={handleFilter} variant="contained">
          Filter
        </Button>
        <Button onClick={handleClearFilter} color="error" variant="contained">
          Clear filter
        </Button>
      </div>
      <div className="ui grid container">
        {subjectBrons.length ? (
          subjectBrons.map((bron) => {
            return (
              <div className="four wide column" key={bron.id}>
                <div className="ui link cards">
                  <div className="card">
                    <div className="image floor">
                      <h1>Bron</h1>
                      <p>Room Number : {bron.RoomId}</p>
                    </div>
                    <div className="content">
                      <div className="header"> {bron.fullName}</div>
                      <div className="meta price">
                        Total Price : {bron.totalPrice}
                      </div>
                      <p>
                        <p> Start Date : {bron.startDate}</p>
                        <p> End Date : {bron.endDate}</p>
                      </p>
                      <div className="bron-links">
                        <Link
                          className="bron-link"
                          onClick={() => history.push(`/editBron/${bron.id}`)}
                        >
                          Edit
                        </Link>
                        <div
                          onClick={() => handleDeleted(bron.id)}
                          className="bron-link"
                        >
                          UnBooking
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
            <p className="date-warning">There are no reservations on these dates</p>
        )}
      </div>
    </>
  );
};

export default BronComponent;