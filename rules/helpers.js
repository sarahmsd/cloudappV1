module.exports = function assocTab(tab){
    let rs = []
    tab.forEach(element => {
      rs[element.param] = element
    });
    return rs
  }