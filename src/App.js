import React, { useState, useEffect } from "react";
import "./App.css";
import MaterialTable from "material-table";
import axios from "axios";
import { Modal, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import validator from "validator";


const columns = [
  { title: "Employee ID", field: "emp_id" },
  { title: "FirstName", field: "firstname" },
  { title: "LastName", field: "lastname" },
  { title: "Email", field: "email" },
  { title: "Salary per Month", field: "salary" },
];
const baseUrl = "https://empolyeebackend.herokuapp.com";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

function App() {
  const styles = useStyles();
  const [EmpolyeeDB, setEmpolyeeDB] = useState([])
  const [data, setData] = useState([]);
  const [ModelInsert, setModelInsert] = useState(false);
  const [ModelEditor, setModelEditor] = useState(false);
  const [ModelDelete, setModelDelete] = useState(false);
  const [Selection, setSelection] = useState({
    emp_id: "",
    firstname: "",
    lastname: "",
    email: "",
    salary: "",
  });
  const [Errors, setErrors] = useState({});
  const validate = (FieldValue = Selection) => {
    let temp = { ...Errors };
    if ("fullname" in FieldValue)
      temp.firstname = Selection.firstname ? "" : "This Field is required";
    if ("lastname" in FieldValue)
      temp.lastname = Selection.lastname ? "" : "This Field is required";
    if ("email" in FieldValue)
      temp.email = validator.isEmail(Selection.email) ? "" : "Vaild mail ID";
    setErrors({
      ...temp,
    });
    if (FieldValue == Selection) return setSelection(temp);
  };
useEffect(() => {
  
  
  return async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setEmpolyeeDB(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}, [data,EmpolyeeDB])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const HandleGet = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HandlePost = (e) => {
    e.preventDefault()
    
     axios.post(baseUrl, Selection)
     HandleModelInsert();
  };

  const HandlePut = async () => {
    const response = await axios.patch(baseUrl + "/" + Selection._id, Selection)
      try {
        var DataNew = data;
        DataNew.map((DataBinding) => {
          if (DataBinding._id === Selection._id ) {
            DataBinding.emp_id = Selection.emp_id;
            DataBinding.firstname = Selection.firstname;
            DataBinding.lastname = Selection.lastname;
            DataBinding.salary = Selection.salary;
            DataBinding.email = Selection.email;
          }
        });
        setData(DataNew);
        HandleModelEditor();
      }
      catch(error) {
        console.log(error);
      };
  };

  const HandleDelete = async () => {
    await axios
      .delete(baseUrl + "/" + Selection._id)
      .then((response) => {
        setData(data.filter((artista) => artista._id == Selection._id));
        HandleModelDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HandleSelection = (artista, caso) => {
    setSelection(artista);
    caso === "Editor" ? HandleModelEditor() : HandleModelDelete();
  };

  const HandleModelInsert = () => {
    setModelInsert(!ModelInsert);
  };

  const HandleModelEditor = () => {
    setModelEditor(!ModelEditor);
  };

  const HandleModelDelete = () => {
    setModelDelete(!ModelDelete);
  };

  useEffect(() => {
    HandleGet();
  }, []);

  const BodyInsertor = (
    <div className={styles.modal}>
      <h3>Adding Of Employee</h3>
      <TextField
        className={styles.inputMaterial}
        label="Empolyee ID"
        name="emp_id"
        type="Number"
        onChange={handleChange}
      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="First Name"
        name="firstname"
        onChange={handleChange}
        helperText={Errors.firstname}

      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="LastName"
        name="lastname"
        onChange={handleChange}
        helperText={Errors.lastname}

      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Email"
        name="email"
        onChange={handleChange}
        helperText={Errors.email}

      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Salary"
        name="salary"
        type="Number"
        onChange={handleChange}
        

      />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={HandlePost}>
          Add
        </Button>
        <Button onClick={() => HandleModelInsert()}>Cancel</Button>
      </div>
    </div>
  );

  const BodyEditor = (
    <div className={styles.modal}>
      <h3>Editor Empolyee</h3>
      <TextField
        className={styles.inputMaterial}
        label="Empolyee ID"
        name="emp_id"
        type="Number"
        onChange={handleChange}
      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="First Name"
        name="firstname"
        onChange={handleChange}
        helperText={Errors.firstname}

      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="LastName"
        name="lastname"
        onChange={handleChange}
        helperText={Errors.lastname}

      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Email"
        name="email"
        onChange={handleChange}
        helperText={Errors.email}

      />
      <br />
      <TextField
        className={styles.inputMaterial}
        label="Salary"
        name="salary"
        type="Number"

        onChange={handleChange}
      />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => HandlePut()}>
          Edit
        </Button>
        <Button onClick={() => HandleModelEditor()}>Cancel</Button>
      </div>
    </div>
  );

  const BodyDelete = (
    <div className={styles.modal}>
      <p>
        Want to Delete Employee <b>{Selection}</b>?{" "}
      </p>
      <div align="right">
        <Button color="secondary" onClick={() => HandleDelete()}>
          Yes
        </Button>
        <Button onClick={() => HandleModelDelete()}>No</Button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <br />
      <Button color="primary"onClick={() => HandleModelInsert()}>Add a Employer</Button>
      <br />
      <br />
      <MaterialTable
        columns={columns}
        data={EmpolyeeDB}
        title="Empolyee Details"
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Empolyee",
            onClick: (event, rowData) => HandleSelection(rowData, "Editor"),
          },
          {
            icon: "delete",
            tooltip: "Delete Empolyee",
            onClick: (event, rowData) => HandleSelection(rowData, "Delete"),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          headerStyle :
          {
            backgroundColor: "black",
            color:"white"

          }
        }}
        localization={{
          header: {
            actions: "Actions",
          },
        }}
      />

      <Modal open={ModelInsert} onClose={HandleModelInsert}>
        {BodyInsertor}
      </Modal>

      <Modal open={ModelEditor} onClose={HandleModelEditor}>
        {BodyEditor}
      </Modal>

      <Modal open={ModelDelete} onClose={HandleModelDelete}>
        {BodyDelete}
      </Modal>
    </div>
  );
}

export default App;
