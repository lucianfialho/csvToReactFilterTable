import React, { useCallback, useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Fab, TextField, Input } from "@material-ui/core";
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import Head from 'next/head'
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Home() {
  const [dataJson, setDataJson] = useState(false);
  const [filteredJsonData, setFilteredJsonData] = useState([])
  const [selectedItems, updateSelectedItems] = useState([]);
  
  const parseCSV = (text) => {
    const result = {
      header: [],
      data: []
    };
  
    const [header, ...content] = text.split('\n');
  
    result.header = header.split(';');
  
    const maxCols = result.header.length;
  
    content.forEach((item) => {
      result.data.push(item.split(';').slice(0, maxCols));
    });
  
    return result;
  };
  
  useEffect(() => {
    if (!dataJson.data) return
    
    const newDataJsonData = recreateDataArray(dataJson.data)
    setFilteredJsonData(newDataJsonData)

  }, [dataJson]);

  const recreateDataArray = (data) => {
    // TODO: Trocar por um array merge nos nomes das chaves
    return data.map((item) => {
      return {
        'code': item[0],
        'description': item[1],
        'unity_ref': item[2],
        'origin_price': item[3],
        'average_price': item[4]
      }
    })

  }
  
  const handleChangeCsv = useCallback((e) => {
    if(e.target.files.length > 0){
      const reader = new FileReader()
      reader.onload = async (e) => { 
        const dataToJson = parseCSV(e.target.result)
        setDataJson(dataToJson)
      };
      reader.readAsText(e.target.files[0])
    }
  }, []);

  const selectItemList = useCallback((data) => {

      updateSelectedItems( arr => data)

    console.log(selectedItems)
  }, []);

  


  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      {!dataJson && (
        <label htmlFor="upload-csv">
          <Input
            style={{ display: "none" }}
            id="upload-csv"
            name="upload-csv"
            type="file"
            onChange={handleChangeCsv}
          />
          <Fab
            color="secondary"
            size="small"
            component="span"
            aria-label="add"
            variant="extended"
          >
            <AddIcon /> Upload Csv
          </Fab>
        </label>
      )}
       
      {dataJson && (
        <Autocomplete
          multiple
          disablePortal
          id="combo-box-demo"
          options={filteredJsonData}
          sx={{ width: 600 }}
          getOptionLabel={(option) => {
            return `${option.code} - ${option.description}`
          }}
          renderInput={(params) => <TextField {...params} label="Pesquisa Fabola :D" />}
          onChange={(event, newInputValue) => selectItemList(newInputValue)}
        />
      )}
      <br/>
      {dataJson && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
              {dataJson.header.map((row) => (
                  <StyledTableCell key={row}>{row}</StyledTableCell>
              ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.map((row) => (
                <StyledTableRow key={row.code}>
                  <StyledTableCell component="th" scope="row">
                    {row.code}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.description}</StyledTableCell>
                  <StyledTableCell align="right">{row.unity_ref}</StyledTableCell>
                  <StyledTableCell align="right">{row.origin_price}</StyledTableCell>
                  <StyledTableCell align="right">{row.average_price}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!dataJson && (
        <h2>Ainda não foi selecionado nenhum item ...</h2>
      )}
      </main>


      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' Alma negra '}
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
