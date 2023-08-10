
import { useState, useEffect, useContext, createContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { GridRowModes, GridToolbarContainer, DataGrid, useGridApiContext, useGridApiRef } from '@mui/x-data-grid';
import { Pagination } from '@mui/material';
import {Button, IconButton} from '@mui/material'
import { CheckBox } from '@mui/icons-material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';


import { useCallback } from 'react';

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

function padTo2Digits(num) {
   return num.toString().padStart(2, '0');
 }
 
 function formatDate(date) {
   if(date === null) return null;
   return [
     padTo2Digits(date.getDate()),
     padTo2Digits(date.getMonth() + 1),
     date.getFullYear(),
   ].join('/');
 }


 function EditToolbar(props) {
   const { setRows, setRowModesModel } = props;
 
   const handleClick = () => {
     const id = "0";
     setRows((oldRows) => [...oldRows, { id:"0", text:"", priority:"Low", dueDate:null, done: false, isNew: true }]);
     setRowModesModel((oldModel) => ({
       ...oldModel,
       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
     }));
   };
 
   return (
     <GridToolbarContainer>
       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
         Add record
       </Button>
     </GridToolbarContainer>
   );
 }

function ToDoList(){


    const apiRef = useGridApiRef();
    const [rows, setRows ] = useState([]); 
    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [urlParams, setUrlParams] = useState("?");
    const [baseuri, setBaseUri] = useState('http://localhost:9090/todos');
    const [rowModesModel, setRowModesModel] = useState({});
   

    useEffect(() => {
      fetch(baseuri + '?'+ urlParams ,{ method: 'GET'})
      .then((response) => response.json())
      .then((data) => {
         data.toDos.forEach(element => {
           if(element.dueDate) {
               element.dueDate = new Date(/\d{4}-\d{2}-\d{2}/.exec(element.dueDate)[0].replace(/-/g, '\/'));
           }
         });
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

      function handleDone(e, id) {
         fetch(baseuri + "/" + id + "/done" ,{ method: 'POST', mode:'cors'})
         .then((response) => response.json())
         .catch((e) => {console.log(e)});
         window.location.reload(false);
      }

      function handleUndone(e, id){
         fetch(baseuri + "/" + id + "/undone" ,{ method: 'PUT', mode:'cors'})
         .then((response) => response.json())
         .catch((e) => {console.log(e)});
         window.location.reload(false);
      }
       

      function onEditButtonClick(e, row) {
         setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.Edit } });
         console.log(rowModesModel);
      }
      
      function onSaveButtonClick(e, row) {
         setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.View } });
      }

      function onCancelButtonClick(e, row) {
         setRowModesModel({
            ...rowModesModel,
            [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
          });
          window.location.reload(false);

      }

      function onDeleteButtonClick(e, row) {
         fetch(baseuri + "/" + row.id ,{ method: 'DELETE', mode:'cors'})
         .then((response) => response.json())
         .catch((e) => {console.log(e)});
         window.location.reload(false);

      }

      function processUpdate(row, oldRow) {
         if(row.isNew) {
            fetch(baseuri + "?"+ "text=" + row.text + "&dueDate=" +formatDate(row.dueDate) + "&priority=" + row.priority ,{ method: 'POST', mode:'cors'})
            .then((response) => response.json())
            .catch((e) => {console.log(e)});
            window.location.reload(false);
            return row;
            
         }
         fetch(baseuri + "/" + row.id + "?"+ "text=" + row.text + "&dueDate=" +formatDate(row.dueDate) + "&priority=" + row.priority ,{ method: 'PUT', mode:'cors'})
         .then((response) => response.json())
         .catch((e) => {console.log(e)});
         return row;
      }
      function handleUpdateError(err) {
         console.log(err);
      }

      const columns = [
        { field: 'done', 
        headerName: 'Done',
         width: 150, 
          sortable:false, 
          disableColumnMenu:true,
          renderCell: (params) => {
            const isDone = params.row.done;
            const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;
            if(isInEditMode) {
               return (
                  <IconButton aria-label="delete" color="primary"
                  disabled
                  >
                     <IndeterminateCheckBoxIcon/>
                     
                   </IconButton>
                   );
            }
            if (isDone)
            return (
            <IconButton aria-label="delete" color="primary"
            onClick={
               (e) => {
                  handleUndone(e, params.row.id)
               }
            }
            >
               <CheckBoxIcon sx={{color: '#239ce8'}}/>
               
             </IconButton>
             );
             return (
               <IconButton aria-label="delete" color="primary"
               onClick={
                  (e) => {
                     handleDone(e, params.row.id)
                  }
               }
            
               >
                  <CheckBoxOutlineBlankIcon />
                </IconButton>
                );
             
           }
         },
        { field: 'text', headerName: 'Name', width: 150, editable: true, sortable:false, disableColumnMenu:true},
        { field: 'priority', headerName: 'Priority', type: "singleSelect",valueOptions: ["High", "Medium", "Low"] ,width: 150, editable: true, disableColumnMenu:true},
        { field: 'dueDate', headerName: 'Due Date', type:"date", width: 150, editable: true, disableColumnMenu:true},
        {
         field: "deleteButton",
         headerName: "Actions",
         description: "Actions column.",
         sortable: false,
         disableColumnMenu:true,
         width: 260,
         renderCell: (params) => {
          const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

           if(isInEditMode) {
               return (
                  <span>
                  <Button variant="text"
                  onClick={
                     (e) => {
                        onSaveButtonClick(e, params.row)
                     }
                  }
                  >
                  Save
                  </Button>
                  <Button variant="text"
                  onClick={
                     (e) => {
                        onCancelButtonClick(e, params.row)
                     }
                  }
               >
                  Cancel
               </Button>
               </span>
               );
             

           }

           return (
            <span>
             <Button variant="text"
               onClick={
                  (e) => {
                     onEditButtonClick(e, params.row)
                  }
               }
             >
               Edit
             </Button>
             <Button variant="text"
               onClick={
                  (e) => {
                     onDeleteButtonClick(e, params.row)
                  }
               }
             >
               Delete
             </Button>
             </span>
           );
         }
       }
      ];
      
    
    return (
        <div>
            <ToDoContext.Provider value={{rows, setRows, pages, setPages, currentPage, setCurrentPage, urlParams, setUrlParams, baseuri, setBaseUri}}>
            <SearchForm/>
            <DataGrid editMode="row" 
                        rows={rows}
                        columns={columns} 
                        hideFooter 
                        rowModesModel={rowModesModel}
                        onSortModelChange={handleSortModelChange} 
                        apiRef={apiRef}
                        slots={{
                           toolbar: EditToolbar,
                         }}
                         slotProps={{
                           toolbar: { setRows, setRowModesModel },
                         }}
                 
                        processRowUpdate={(updatedRow, originalRow) =>
                           processUpdate(updatedRow, originalRow)
                         }
                        onProcessRowUpdateError = {handleUpdateError}

            />
            <Pagination count={pages} page={currentPage} onChange={changePage} showLastButton showFirstButton/>
            </ToDoContext.Provider>
        </div>
     );
}

export default ToDoList;
