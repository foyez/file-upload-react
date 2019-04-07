var areaEl = document.getElementById("areas");
var roadEl = document.getElementById("roads");
var imgInputEl = document.getElementById("imgInput");
var geoInputEl = document.getElementById("geoInput");
var uploadBtn = document.getElementById("upload");
var dropArea = document.getElementById("dropArea");
var output = document.getElementById("result");
var ul = output.querySelector("ul");

let loaded = 0;
let selectedAreaId;
let selectedRoadId;
let selectedRoadName;
let imgJSON;
let geoJSON;
var webkitResult = [];

axios.get("https://map.barikoi.xyz:8070/api/area").then(res => {
  const areas = res.data;

  areas.map(area => {
    areaEl.innerHTML += `<option value=${area.id}>${area.area_name}</option>`;
  });
});

function roadList(areaId) {
  axios.get(`https://map.barikoi.xyz:8070/api/area/get/road/${areaId}`).then(res => {
    let roads = res.data;
    roads = roads.sort((a, b) => {
      if (a.road_name_number < b.road_name_number) {
        return -1;
      }
      if (a.road_name_number > b.road_name_number) {
        return 1;
      }
      return 0;
    });

    console.log(roads);
    roads.map(road => {
      roadEl.innerHTML += `<option value=${road.id}>${road.road_name_number}</option>`;
    });
  });
}

function handleSelectedArea(event) {
  console.log(event.target.value);
  selectedAreaId = event.target.value;
  roadList(selectedAreaId);
}

function handleSelectedRoad(selected) {
  selectedRoadId = selected.options[selected.selectedIndex].value;
  selectedRoadName = selected.options[selected.selectedIndex].text;
}

function handleImgJSON(event) {
  const selectedFile = event.target.files[0];
  const fileReader = new FileReader();

  fileReader.readAsText(selectedFile);
  fileReader.onload = event => {
    imgJSON = JSON.parse(event.target.result);
    console.log(imgJSON);
  };
}

function handleGeoJSON(event) {
  const selectedFile = event.target.files[0];
  const fileReader = new FileReader();

  fileReader.readAsText(selectedFile);
  fileReader.onload = event => {
    geoJSON = JSON.parse(event.target.result);
    console.log(geoJSON);
  };
}

function dragHandler(event) {
  event.stopPropagation();
  event.preventDefault();
  dropArea.className = "area drag";
}

function filesDroped(event) {
  // var webkitResult = [];
  var mozResult = [];
  var files;
  console.log(event);
  event.stopPropagation();
  event.preventDefault();
  dropArea.className = "area";

  // do mozilla stuff
  function mozReadDirectories(entries, path) {
    console.log("dir", entries, path);
    return [].reduce
      .call(
        entries,
        function(promise, entry) {
          return promise.then(function() {
            return Promise.resolve(entry.getFilesAndDirectories() || entry).then(function(dir) {
              return dir;
            });
          });
        },
        Promise.resolve()
      )
      .then(function(items) {
        var dir = items.filter(function(folder) {
          return folder instanceof Directory;
        });
        var files = items.filter(function(file) {
          return file instanceof File;
        });
        if (files.length) {
          // console.log("files:", files, path);
          mozResult = mozResult.concat.apply(mozResult, files);
        }
        if (dir.length) {
          // console.log(dir, dir[0] instanceof Directory);
          return mozReadDirectories(dir, dir[0].path || path);
        } else {
          if (!dir.length) {
            return Promise.resolve(mozResult).then(function(complete) {
              return complete;
            });
          }
        }
      });
  }

  function handleEntries(entry) {
    let file = "webkitGetAsEntry" in entry ? entry.webkitGetAsEntry() : entry;
    return Promise.resolve(file);
  }

  function handleFile(entry) {
    return new Promise(function(resolve) {
      if (entry.isFile) {
        entry.file(function(file) {
          listFile(file, entry.fullPath).then(resolve);
        });
      } else if (entry.isDirectory) {
        var reader = entry.createReader();
        reader.readEntries(webkitReadDirectories.bind(null, entry, handleFile, resolve));
      } else {
        var entries = [entry];
        return entries
          .reduce(function(promise, file) {
            return promise.then(function() {
              return listDirectory(file);
            });
          }, Promise.resolve())
          .then(function() {
            return Promise.all(
              entries.map(function(file) {
                return listFile(file);
              })
            ).then(resolve);
          });
      }
    });

    function webkitReadDirectories(entry, callback, resolve, entries) {
      console.log(entries);
      return listDirectory(entry)
        .then(function(currentDirectory) {
          console.log(`iterating ${currentDirectory.name} directory`, entry);
          return entries.reduce(function(promise, directory) {
            return promise.then(function() {
              return callback(directory);
            });
          }, Promise.resolve());
        })
        .then(resolve);
    }
  }

  function listDirectory(entry) {
    console.log(entry);
    var path = entry.fullPath || entry.webkitRelativePath.slice(0, entry.webkitRelativePath.lastIndexOf("/"));
    var cname = path
      .split("/")
      .filter(Boolean)
      .join("-");
    console.log("cname", cname);
    if (!document.getElementsByClassName(cname).length) {
      var directoryInfo = `<li><ul class=${cname}>
                      <li>
                      <span>
                        Directory Name: ${entry.name}<br>
                        Path: ${path}
                        <hr>
                      </span>
                      </li></ul></li>`;
      var curr = document.getElementsByTagName("ul");
      var _ul = curr[curr.length - 1];
      var _li = _ul.querySelectorAll("li");
      if (!document.querySelector("[class*=" + cname + "]")) {
        if (_li.length) {
          _li[_li.length - 1].innerHTML += `${directoryInfo}`;
        } else {
          _ul.innerHTML += `${directoryInfo}`;
        }
      } else {
        ul.innerHTML += `${directoryInfo}`;
      }
    }
    return Promise.resolve(entry);
  }

  function listFile(file, path) {
    path = path || file.webkitRelativePath || "/" + file.name;
    var filesInfo = `<li>
                        Name: ${file.name}</br> 
                        Size: ${file.size} bytes</br> 
                        Type: ${file.type}</br> 
                        Modified Date: ${file.lastModifiedDate}<br>
                        Full Path: ${path}
                      </li>`;

    var currentPath = path.split("/").filter(Boolean);
    currentPath.pop();
    var appended = false;
    var curr = document.getElementsByClassName(`${currentPath.join("-")}`);
    if (curr.length) {
      for (li of curr[curr.length - 1].querySelectorAll("li")) {
        if (li.innerHTML.indexOf(path.slice(0, path.lastIndexOf("/"))) > -1) {
          li.querySelector("span").insertAdjacentHTML("afterend", `${filesInfo}`);
          appended = true;
          break;
        }
      }
      if (!appended) {
        curr[curr.length - 1].innerHTML += `${filesInfo}`;
      }
    }
    console.log(`reading ${file.name}, size: ${file.size}, path:${path}`);
    webkitResult.push(file);
    return Promise.resolve(webkitResult);
  }

  function processFiles(files) {
    Promise.all(
      [].map.call(files, function(file, index) {
        return handleEntries(file, index).then(handleFile);
      })
    )
      .then(function() {
        console.log("complete", webkitResult);
      })
      .catch(function(err) {
        alert(err.message);
      });
  }

  if ("getFilesAndDirectories" in event.target) {
    return (event.type === "drop" ? event.dataTransfer : event.target)
      .getFilesAndDirectories()
      .then(function(dir) {
        if (dir[0] instanceof Directory) {
          console.log(dir);
          return mozReadDirectories(dir, dir[0].path || path).then(function(complete) {
            console.log("complete:", complete);
            event.target.value = null;
          });
        } else {
          if (dir[0] instanceof File && dir[0].size > 0) {
            return Promise.resolve(dir).then(function(complete) {
              console.log("complete:", complete);
            });
          } else {
            if (dir[0].size == 0) {
              throw new Error(
                "could not process '" +
                  dir[0].name +
                  "' directory" +
                  " at drop event at firefox, upload folders at 'Choose folder...' input"
              );
            }
          }
        }
      })
      .catch(function(err) {
        alert(err);
      });
  }

  // do webkit stuff
  if (event.type === "drop" && event.target.webkitdirectory) {
    files = event.dataTransfer.items || event.dataTransfer.files;
  } else if (event.type === "change") {
    files = event.target.files;
  }

  if (files) {
    processFiles(files);
    // console.log(files);
  }
}

function handleUpload() {
  imgJSON.scenes.forEach((scene, i) => {
    scene.latitude = geoJSON.data[i].latitude;
    scene.longitude = geoJSON.data[i].longitude;
  });
  imgJSON.geometry_id = selectedRoadId;

  console.log(imgJSON);
  const data = new FormData();

  if (imgJSON !== null && geoJSON !== null) {
    data.append("geometry_id", selectedRoadId);
    data.append("road_name", selectedRoadName);
    data.append("scenes", JSON.stringify(imgJSON.scenes));
    // data.append("imageFolder", webkitResult);
    webkitResult.forEach(file => {
      data.append("imgFolder[]", file, file.name);
    });

    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  }
}

areaEl.addEventListener("change", handleSelectedArea);
// roadEl.addEventListener("change", handleSelectedRoad);
imgInputEl.addEventListener("change", handleImgJSON);
geoInputEl.addEventListener("change", handleGeoJSON);
uploadBtn.addEventListener("click", handleUpload);
dropArea.addEventListener("dragover", dragHandler);
dropArea.addEventListener("change", filesDroped);
dropArea.addEventListener("drop", filesDroped);
