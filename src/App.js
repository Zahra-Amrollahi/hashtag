


// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import fetch from 'cross-fetch';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { tagAction } from './_action/tag.action'

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function findHashtag(str) {
  const hashtag = '#';
  let result = '';
  const hashtagIndex = str.lastIndexOf(hashtag);
  if (!~hashtagIndex) {
    return result;
  }


  if (str[hashtagIndex + 1] === ' ') {
    return result;
  }

  const nextSpace = str.indexOf(' ', hashtagIndex + 1);

  if (nextSpace === -1) {
    result += str.substring(hashtagIndex + 1);
  }

  else {
    result += str.substring(hashtagIndex + 1, nextSpace);
  }
  return result;
}

function App() {
  debugger
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [hashtag, setHashtag] = React.useState("");
  const loading = open && hashtag;


  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch('https://cors-anywhere.herokuapp.com/' + `https://hm2.ir/tag/?type=tag&tag=${hashtag}`);
      await sleep(1e3); // For demo purposes.
      const tags = await response.json();
      console.log('tags' + tags);

      if (active) {
        setOptions(tags.list);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);



  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={(e) => {


        setHashtag(String(findHashtag(e.target.value)));
        console.log(`hashtagh ${hashtag}`);
      }

      }
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}



export default App;
