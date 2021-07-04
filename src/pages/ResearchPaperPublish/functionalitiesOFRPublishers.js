import React , { useEffect , useState } from "react";
import axios from 'axios';
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import GetAppIcon from '@material-ui/icons/GetApp';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 610,
  },
}));
export default function ResearchPaper() {
    let number=0;
    const [publishers, setPublisers] = useState([]);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        axios.get("/get-approved-research-paper-publishers")
        .then(response => {
            console.log(response.data.data);
            setPublisers(response.data.data);
        })
        .catch(error => {
            console.log(error.message);
        })
    }, [trigger]);

    const handleApproval = (id) =>{
      axios.put(`/set-research-paper-approved/${id}`)
      .then(response => {
        console.log('email');
        axios.get(`/send-email-to-approved-researchpapers/${id}`)
        .then(response => {
          console.log(response.data.data);
        })
        .catch(error => {
          console.log(error.message);
        })
        number = number + 1;
        setTrigger(number)
        console.log(response.data.data);
      })
      .catch(error => {
        console.log(error.message);
      })
    }

    const onDownload = (url) => {
      const link = document.createElement('a');
      link.href = url;
      link.click();
    }

    const onDeleteHandlle = (id) => {
      axios.delete(`/delete-publiser/${id}`)
      .then(response => {
        console.log(response.data.data);
        number = number + 1;
        setTrigger(number)
      })
      .catch(error => {
        console.log(error.message)
      })
    }




  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={12}>
            <Paper className={fixedHeightPaper}>
            <center><h3>Research Paper publishers</h3></center>
            <table className="styled-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Approval</th>
                    <th>Download Paper</th>
                    <th>Give approval</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                {publishers.map((publisher) => (
                  <tbody>
                    <tr key={publisher._id}>
                      <td>{publisher.first_name}</td>
                      <td>{publisher.last_name}</td>
                      <td>{publisher.email}</td>
                      <td>{publisher.phone}</td>
                      <td>{publisher.is_approved.toString()}</td>
                      <td>
                        <Button variant="outlined" color="secondary" onClick={() => onDownload(publisher.researchPaper_url)} endIcon={<GetAppIcon />} >
                          Download
                        </Button>
                      </td>
                      <td>
                        <Button variant="outlined" color="primary" onClick={() => handleApproval(publisher._id)} endIcon={ <DoneIcon/> }>
                          Approve
                        </Button>
                      </td>
                      <td>
                        <Button variant="outlined" color="secondary" onClick={() => onDeleteHandlle(publisher._id)} endIcon={ <DeleteIcon/> }>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
