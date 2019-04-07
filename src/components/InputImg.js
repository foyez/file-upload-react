import React, { Component } from "react";

class InputImg extends Component {
  handleDrag = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  // do mozilla stuff
  mozReadDirectories(entries, path) {
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

  handleEntries(entry) {
    let file = "webkitGetAsEntry" in entry ? entry.webkitGetAsEntry() : entry;
    return Promise.resolve(file);
  }

  handleFile(entry) {
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

  listDirectory(entry) {
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

  listFile(file, path) {
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

  processFiles(files) {
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

  handleFilesDropped = event => {
    let webkitResult = [];
    let mozResult = [];
    let files;

    event.stopPropagation();
    event.preventDefault();

    mozReadDirectories(entries, path);
    handleEntries(entry);
    handleFile(entry);
    listDirectory(entry);
    listFile(file, path);
    processFiles(files);

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
    }
  };

  render() {
    return (
      <div>
        <p className="attach-text">Attach Road Images Folder:</p>
        <label id="dropArea" className="area" onDragover={handleDrag} onChange={handleFilesDropped}>
          <input id="file" type="file" directory allowdirs webkitdirectory />
        </label>
      </div>
    );
  }
}

export default InputImg;
