
import { useState, useEffect, createContext, forwardRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { GridRowModes, GridToolbarContainer, DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { Pagination } from '@mui/material';
import {Button, IconButton} from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


import SearchForm from './Form';
import InfoBox from './InfoBox';

const Alert = forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
 });

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
       setBaseUri: () => {},
       averageTime: {
         total: "--:--:-- hours",
         low: "--:--:-- hours",
         mediun: "--:--:-- hours",
         high: "--:--:-- hours",
         
       },
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
    const [urlParams, setUrlParams] = useState({});
    const [baseuri, setBaseUri] = useState('http://localhost:9090/todos');
    const [rowModesModel, setRowModesModel] = useState({});
    const [sortByPriority, setSortByPriority] = useState(0);
    const [sortByDueDate, setSortByDueDate] = useState(0);
    const [priorityString, setPriorityString] = useState("Priority");
    const [dateString, setDateString] = useState("Due Date");
    const [doneAll, setDoneAll] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("Error");
    const [averageTime, setAverageTime] = useState({
      all: "--:--:-- hours",
      low: "--:--:-- hours",
      medium: "--:--:-- hours",
      high: "--:--:-- hours",
    });
  
    const handleCloseSnack = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenAlert(false);
    };
   

    useEffect(() => {
      const paramsString = '?' + Object.keys(urlParams).map(key => { return `${key}=${encodeURIComponent(urlParams[key])}`; }).join('&');
      setDoneAll(doneAll);
      
      fetch(baseuri + paramsString ,{ method: 'GET'})
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
         setAverageTime(
            {
               all: data.timeAverage,
               low: data.lowAverage,
               medium: data.mediumAverage,
               high: data.highAverage
            }
         );
      })
      .catch((err) => {
         console.log(err.message);
      });
     }, [urlParams]);

     function changePage(e, value) { 
      setUrlParams( {
            ... urlParams,
            page: value,
          }
          ); 
      }

      function handleSortModelChange(model, details) {
         if(details == []) {
            
         }
      }

      function handleDone(e, id) {
         fetch(baseuri + "/" + id + "/done" ,{ method: 'POST', mode:'cors'})
         .then((response) => response.json())
         .catch((e) => {console.log(e)});
         //window.location.reload(false);
         setUrlParams({...urlParams});
      }

      function handleUndone(e, id){
         setDoneAll(false);
         fetch(baseuri + "/" + id + "/undone" ,{ method: 'PUT', mode:'cors'})
         .then((response) => response.json())
         .catch((e) => {console.log(e)});
         //window.location.reload(false);
         setUrlParams({...urlParams});

      }

      function handleDoneAll(e) {
         setDoneAll(true);
         console.log(e);
         const newRows = rows.map( row => {
            if(!row.done)
            handleDone(e, row.id)
            });
      }
      function handleUndoneAll(e) {
         console.log(e);
         const newRows = rows.map( row => {
            if(row.done)
            handleUndone(e, row.id)
            });
      }
       

      function onEditButtonClick(e, row) {
         setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.Edit } });
      }
      
      function onSaveButtonClick(e, row) {
         setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.View } });
      }

      function onCancelButtonClick(e, row) {
         setRowModesModel({
            ...rowModesModel,
            [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
          });
          setUrlParams({...urlParams});

      }

      function onDeleteButtonClick(e, row) {
         fetch(baseuri + "/" + row.id ,{ method: 'DELETE', mode:'cors'})
         .then((response) => response.json())
         .catch((e) => {console.log(e)});
         setUrlParams({...urlParams});

      }

      function handleSortingClick(params, event, detais){   
         if(params.field == 'priority' ) {
            if(sortByPriority == 1) {
               setSortByPriority(-1);
               setPriorityString("Priority (asc)");
               setUrlParams({
                  sortByPriority: -1,
                  sortByDueDate: sortByDueDate,
               });
            } else {
               setPriorityString( sortByPriority === 0 ? "Priority (desc)" : "Priority");
               setSortByPriority(sortByPriority+ 1);
               setUrlParams({
                  sortByPriority: sortByPriority +1,
                  sortByDueDate: sortByDueDate,
               });
            }
            

         } else if (params.field == 'dueDate') {
            if(sortByDueDate == 1) {
               setSortByDueDate(-1);
               setDateString("Due Date (desc)");
               setUrlParams({
                  sortByPriority: sortByPriority,
                  sortByDueDate: -1,
               });
            } else {
               setDateString( sortByDueDate === 0 ? "Due Date (asc)" : "Due Date");
               setSortByDueDate(sortByDueDate+ 1);
               setUrlParams({
                  sortByPriority: sortByPriority,
                  sortByDueDate: sortByDueDate+1,
               });
            }
         }
      }

      function processUpdate(row, oldRow) {
         if(row.isNew) {
            fetch(baseuri + "?"+ "text=" + row.text + "&dueDate=" +formatDate(row.dueDate) + "&priority=" + row.priority ,{ method: 'POST', mode:'cors'})
            .then((response) => (
               response.json()
            )).then( (data) => {
               if(data.status == 406) {
                  throw new Error(data.reason);
               }
            })
            .catch((e) => {
               setMessage(e.toString())
               setOpenAlert(true);
               setUrlParams({...urlParams});
            
            });
            return row;
            
         }
         fetch(baseuri + "/" + row.id + "?"+ "text=" + row.text + "&dueDate=" +formatDate(row.dueDate) + "&priority=" + row.priority ,{ method: 'PUT', mode:'cors'})
         .then((response) => response.json())
         .then( (data) => {
            if(data.status == 406) {
               throw new Error(data.reason);
            }
         })
         .catch((e) => {
            setMessage(e.toString())
            setOpenAlert(true);
            setUrlParams({...urlParams});
         
         });
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
          renderHeader: (params) => {
            if(doneAll) {

               return (
                  <IconButton aria-label="delete" color="primary"
                  onClick={
                     (e) => {
                        handleUndoneAll(e)
                     }
                  }
                  >
                     <CheckBoxIcon sx={{color: '#239ce8'}}/>
                     
                   </IconButton>
                   );
            }

            return(
            <IconButton aria-label="delete" color="primary"
               onClick={
                  (e) => {
                     handleDoneAll(e)
                  }
               }
            
               >
                  <CheckBoxOutlineBlankIcon />
                </IconButton>
            );
          }
          ,
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
        { field: 'text', headerName: 'Name', width: 600, editable: true, sortable:false, disableColumnMenu:true},
        { field: 'priority',
         headerName: priorityString,
          sortable:false, type: "singleSelect",
          valueOptions: ["High", "Medium", "Low"] ,
          width: 150, 
          editable: true,
           disableColumnMenu:true,
           renderHeader: (params) => {
            if(sortByPriority==1) {

               return (
                  <><p>Priority</p><ArrowDownwardIcon /></>
               );
            } else if (sortByPriority==-1) {
               return (
                  <><p>Priority</p><ArrowUpwardIcon /></>
               );
            }

            return (
               <><p>Priority</p><SortIcon /></>
            );
          },


      },
        { field: 'dueDate',
         headerName: dateString, 
         sortable:false ,type:"date",
          width: 150,
           editable: true, 
           disableColumnMenu:true,
           renderHeader: (params) => {
            if(sortByDueDate==1) {

               return (
                  <><p>Due Date</p><ArrowUpwardIcon /></>
               );
            } else if (sortByDueDate==-1) {
               return (
                  <><p>Due Date</p><ArrowDownwardIcon /></>
               );
            }

            return (
               <><p>dueDate</p><SortIcon /></>
            );
          },
      
      },
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
            <ToDoContext.Provider value={{rows, setRows, pages, setPages, currentPage, setCurrentPage, urlParams, setUrlParams, baseuri, setBaseUri, averageTime,setAverageTime}}>
            <SearchForm/>
            <DataGrid editMode="row" 
                        rows={rows}
                        columns={columns} 
                        hideFooter 
                        rowModesModel={rowModesModel}
                        onSortModelChange={handleSortModelChange} 
                        apiRef={apiRef}
                        rowHeight={100}
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
                        onColumnHeaderClick={handleSortingClick}

            />
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseSnack}>
               <Alert onClose={handleCloseSnack} severity="error" sx={{ width: '100%' }}>
                  {message}
               </Alert>
      </Snackbar>
            <Pagination count={pages} page={currentPage} onChange={changePage} showLastButton showFirstButton/>
            <InfoBox/>
            </ToDoContext.Provider>
        </div>
     );
}

export default ToDoList;
