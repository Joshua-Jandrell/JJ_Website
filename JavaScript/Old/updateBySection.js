// This script is responsibale for updating elements with the given id when a spsific scroll target is reached.
// currently not compatable with idex.js due to similar html manamaplation features which may cause strange behaviour when wroking together

// costants
const offsetMultDefault = 0.5; // how far down the window must a dive be for the scroll offset to trigger
const scrollMarkerGroups = [];
const markerIdNavSuffex = "-nav-elem";
// glabal scope varables
let currentMarker = "none"; // the id of the marker the user has currently scrolled to.

// Setup ===========================
function SetIndependantMarkers(
  markerClass,
  addedClass,
  sameAsTarget,
  offsetMult = offsetMultDefault
) {
  let markerArray = Array.from(document.getElementsByClassName(markerClass));
  let newMarker = new SingleMarker(
    markerArray,
    addedClass,
    sameAsTarget,
    offsetMult
  );
  scrollMarkerGroups.push(newMarker);
  window.addEventListener("scroll", () => newMarker.UpdateMarker());
}
function SetScrollPointMarkers(
  markerClass,
  addedClass,
  sameAsTarget = false,
  offsetMult = offsetMultDefault
) {
  let markerArray = Array.from(document.getElementsByClassName(markerClass));
  let markergroup = new MarkerGroup(
    markerArray,
    addedClass,
    sameAsTarget,
    offsetMult
  );
  scrollMarkerGroups.push(markergroup);
  window.addEventListener("scroll", () => markergroup.UpdateMarker());
}

// requires a nav bar
function SetNavMarkers(navIds, offsetMult) {
  let markers = [];
  navIds.forEach((id) => {
    markers.push(document.getElementById(id));
  });
  let navMarkers = new NavMarkerGroup(markers, offsetMult);
  scrollMarkerGroups.push(navMarkers);
  window.addEventListener("scroll", () => navMarkers.UpdateMarker());
}
// Useful Calsses =================
class MarkerGroup {
  constructor(markers, addedClass, sameAsTarget, offsetMult) {
    this.markers = markers;
    this.addedClass = addedClass;
    this.sameAsTarget = sameAsTarget;
    this.currentMarker = "none";
    this.offsetMult = offsetMult;
  }
  UpdateMarker() {
    let newCurrent = GetCurrentMarker(this.markers, this.offsetMult);
    if (newCurrent != this.currentMarker) {
      if (this.sameAsTarget) {
        ToggleClasses(newCurrent, this.currentMarker, this.addedClass);
      } else {
        ToggleNavClasses(newCurrent, this.currentMarker, this.addedClass);
      }
      this.currentMarker = newCurrent;
    }
  }
}

class NavMarkerGroup {
  constructor(markers, offsetMult) {
    this.markers = markers;
    this.currentMarker = "none";
    this.offsetMult = offsetMult;
  }
  UpdateMarker() {
    let newCurrent = GetCurrentMarker(this.markers, this.offsetMult);
    if (newCurrent != this.currentMarker) {
      if (typeof SelectNavSection !== "undefined")
        SelectNavSection(newCurrent.id + "-nav");
      this.currentMarker = newCurrent;
    }
  }
}

// The single marker does not share its class with a group
class SingleMarker {
  constructor(markers, addedClass, sameAsTarget, offsetMult) {
    this.markers = markers;
    this.addedClass = addedClass;
    this.sameAsTarget = sameAsTarget;
    this.currentMarker = "none";
    this.offsetMult = offsetMult;
  }
  UpdateMarker() {
    this.markers.forEach((marker) => {
      let target = marker;
      if (!this.sameAsTarget) {
        target = document.getElementById(GetMarkerNavId(marker.id));
      }
      if (IsVIsisble(marker, this.offsetMult)) {
        AddClass(target, this.addedClass);
      } else {
        RemoveClass(target, this.addedClass);
      }
    });
  }
}

// CSS Class updating =================
function ToggleNavClasses(newElem, oldElem, togglClass) {
  let newNavId = GetMarkerNavId(newElem.id);
  let newNav = document.getElementById(newNavId);
  let oldNavId = GetMarkerNavId(oldElem.id);
  let oldNav = document.getElementById(oldNavId);
  ToggleClasses(newNav, oldNav, togglClass);
}
function ToggleClasses(newElem, oldElem, toggleClass) {
  AddClass(newElem, toggleClass);
  RemoveClass(oldElem, toggleClass);
}
function AddClass(elem, addedClass) {
  if (elem != "none" && elem != null) {
    if (!elem.classList.contains(addedClass)) {
      elem.classList.add(addedClass);
    }
  }
}
function RemoveClass(elem, classToRemove) {
  if (elem != "none" && elem != null) {
    if (elem.classList.contains(classToRemove)) {
      elem.classList.remove(classToRemove);
    }
  }
}
// Scroll position checking =================
function GetCurrentMarker(markers, offsetMult) {
  let currMarker = "none";
  markers.forEach((marker) => {
    if (IsVIsisble(marker, offsetMult)) {
      currMarker = marker;
    }
  });
  return currMarker;
}
function IsVIsisble(el, offsetMult) {
  let rect = el.getBoundingClientRect();
  pos = rect.top;
  return pos <= GetOffset(offsetMult);
}
// Get offset dynamically to accounted for window re-sizing
function GetOffset(offsetMult) {
  return window.innerHeight * offsetMult;
}
// id finding ==============================
function GetMarkerNavId(targetId) {
  return targetId + markerIdNavSuffex;
}
