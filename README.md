# scalioTableLibrary
Custom library handle array of objects

This readme comprehensively states the capabilities and constraints of the scal.io table library

Note: 
1. This library contains about 83 functional unit test which covered all the components, services and interceptors.
2. This library is built to be easily extensible(The Results Table and Search Component was created in the shared module so they can easily be imported any module in the future that needs them).
3. The library is fairly responsive. As it allows horizontal scrolling in a case where the table width overflows.
4. The library adopts http error interceptors for handling errors, appending the base url from the environment to the base of any api call that needs it and also for triggering and stopping the loader component of the application. 
5. The library fully avoided memory leaks by ensuring the async pipe is used to subscribe to observables when neccessary. For cases where the subscription is done within the .ts, the emmisions are stopped on destroy of the subscribing components. This was achieved by using the takeUntil rxjs operator, creating a destroy$ subject that triggers mainly on destroy of the component.
6. Appropriate typings were adopted.


-----------------------------------
# RESULTS TABLE COMPONENT
Below are the @Input paramaters to get the Results Table up and running:
1. processType - This represent how we want the table operations to be carried out either from the client side or the server side. For example, for this exercise the processType is specified as client since the sort and paginating will be done from the client side. Note: In a case where this input is not provided, the default 'client' is used. In the future we might want to implement the server side pagination then that will be incorporated seamlessly.

2. isLoading - This flag helps to inform the result component that data is currently been loaded into the application. This flag is set to true immediately after the submit button is clicked and set back to false as soon as data from back from the api call.

3. data - This is the array of items(in this case, the array of users) returned from the API call.

4. searchInput - This is the search value typed in by the user.

5. config - This determines how the passed on data is to be configured. For example the columns to be displayed. In a case where the config is not passed on, the table automatically maps the column to display to the keys of the first object in the array of items(for example, the keys of items[0]);

-----------------
The configuration that will be passed on to no 7 above is detailed below:

# Table configuration:
The library has a ResultsTableConfiguration model that specifies the model of the data that should be passed on as an input into the table. The ResultsTableConfiguration consist of two keys (defaultSort and columns).

a. defaultSort: This determines which column on the table should be sorted by default. The defaultSort is an object that consists of the name of the column to be sorted and the sort direction. the sort direction can eithe be 'asc' for ascending order sorting or 'desc' for descending order sorting. For this exercise defaultSort: {name: 'login', sortDirection: 'asc'} was used because the requirement was that on load of the table, the table should be sorted by the login column. In a case where the requirement wants us to specify descending order as the default for the login column, 'desc' is used. If for example, avatar_url is specified in the future to be the default sort column for the table all that we have to do is just update the defaultSort name to 'avatar_url'.

b. columns: The columns accepts an array of objects with the model ColumnConfiguration. The ColumnConfiguration consist of about 10 keys with their corresponding data types namely: 
  isHeaderHidden?: boolean;
  name?: string;
  sort?: string;
  label?: string;
  align?: CellAlign;
  padding?: CellPadding;
  width?: number | string;
  hideColumn?: boolean;
  preserveWhitespace?: boolean;
  sortable?: boolean;
  hideOverflow?: boolean;
  
  i. isHeaderHidden: This is a flag that determine if the header of a particular column should be hidden. if set to false for a specified column, the column header          will be hidden.
  
  ii. name: This is the name of the key that maps to the key of from the API whole data should be rendered in the specified column.
  
  iii. sort: This maps to the key on the api that we are sorting by. For example a column 'login' that needs to be sorted by 'login' items will have 'login' supplied         to this field.
  
  iv. label: This is the label that would be supplied to the header. You might want to value passed to it as the same as that passed to the name key above. However in       cases like where they key has an underscore like the avatar_url you might want to pass on 'avatar url' or any descriptive text as the case may be.
  
  v. align: This is used to set how you want the column contents to be aligned. For this library, you can mainly align to either 'left', 'center' or 'right';
  
  vi. padding: This is used to specify the padding of the content of the column.
  
  vii. width: You can pass in fixed width in cases when you want a column to take a particular with. You either specify a number or string. for example (10 or 10%);
  
  viii. preserveWhitespace: Pass true if you want the preserveWhitespace feature on the column.
  
  ix. sortable: This determines if the column is sortable or not. for this exercise, sortable is set to true for login, avatar_url and type.
  
  x. hideOverflow: If set to true hides overflow on the table.
  
-------------------------  
# SEARCH COMPONENT:
Below is the @Input paramaters to get the search up and running:
  1. placeholder: This is the place holder text that should be displayed within the input field.

Below are the @Output paramaters:
  1. searchStringEvent: This emits whats the search string typed in by the user on click of the submit button.


------------------------- 
# EXTRA COMPONENTS:
# Pagination Component
Below are the @Input paramaters to get the Table pagination up and running:
 1. items: This is the data passed in number 3 above to the results table.
 
 2. pageSize: This is the size of the items currently rendered on the page. For this exercise, 9 is passed on and it is also defaulted to 9 for cases when no specified page size was specified. 

Below are the @Output paramaters:
  1. changePage: This emits the chunk of data within the list that should be rendered on the page.

# Notification Component
 - Displays the user notification. For example, cases where there is an error from the API, the error is passed on via a subject to the component to be notify the user. The notification closes by default after the specified duration to seconds is reached. The notification component can also be closed by clicking on the cancel icon on the far top right of the component.

# Loader Component.
 - Displayed mainly when an API call is made to the backend service. It is triggered by the loader interceptor when the API request is started and closed when the api request is completed and response is returned.
