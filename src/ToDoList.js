
import { useState, useEffect, useContext, createContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Pagination } from '@mui/material';


import SearchForm from './Form';

export const ToDoContext = createContext(
   {
      rows: [],
      setRows: () => {},
      pages: 1,
       setPages: () => {},
      currentPage:1 , 
      setCurrentPage: () => {}, 
      urlParams: "?",
       setUrlParams:() => {}, 
       baseuri:"", 
       setBaseUri: () => {}
   }
);

function ToDoList(){
    const [rows, setRows ] = useState([]); 
    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [urlParams, setUrlParams] = useState("?");
    const [baseuri, setBaseUri] = useState('http://localhost:9090/todos');
   

    useEffect(() => {
      fetch(baseuri + '?'+ urlParams ,{ method: 'GET'})
      .then((response) => response.json())
      .then((data) => {
         data.toDos.forEach(element => {
           if(element.dueDate) {
               element.dueDate = new Date(/\d{4}-\d{2}-\d{2}/.exec(element.dueDate)[0].replace(/-/g, '\/'));
           }
         });
         console.log(data);
         setRows(data.toDos);
         setPages(data.pages);
         setCurrentPage(data.currentPage);
      })
      .catch((err) => {
         console.log(err.message);
      });
     }, [urlParams, currentPage, pages]);

     function changePage(e, value) { 
      setUrlParams( new URLSearchParams({
            page: value,
        }));
      
      }
      function handleSortModelChange(model, details) {
         if(details == []) {
            
         }
      }

      const columns = [
        { field: 'done', headerName: 'Done', type: "boolean", width: 150, editable: true },
        { field: 'text', headerName: 'Name', width: 150, editable: true},
        { field: 'priority', headerName: 'Priority', type: "singleSelect",valueOptions: ["High", "Medium", "Low"] ,width: 150, editable: true},
        { field: 'dueDate', headerName: 'Due Date', type:"date", width: 150, editable: true},
      ];
    
    return (
        <div>
            <ToDoContext.Provider value={{rows, setRows, pages, setPages, currentPage, setCurrentPage, urlParams, setUrlParams, baseuri, setBaseUri}}>
            <SearchForm/>
            <DataGrid editMode="row" rows={rows} columns={columns} hideFooter onSortModelChange={handleSortModelChange}/>
            <Pagination count={pages} page={currentPage} onChange={changePage} showLastButton showFirstButton />
            </ToDoContext.Provider>
        </div>
     );
}

export default ToDoList;
