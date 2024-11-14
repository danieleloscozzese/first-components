/**
 * Focuses without scroll and then smoothly scrolls horizontally to the tab.
 * The two operations are separated by a frame.
 * @param {HTMLElement} element The element to focus and scroll to.
 * @returns {void}
 */
const focusAndScroll = (element) => {
  requestAnimationFrame(() => {
    element.focus({ preventScroll: true });

    requestAnimationFrame(() => {
      // Smoothly scroll to the element, aligning it with the start of the
      // container to ensure the tab is fully visible.
      element.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    });
  });
};

/**
 * Implements the manual keyboard navigation for the tab group.
 * @param {KeyboardEvent} evt The `keydown` event triggered on a tab's button.
 * @param {Number} index The index of the tab in the collection.
 * @returns {void}
 */
const navigateTabs = (evt, index) => {
  // Keyboard navigation is handled but tabbing is left to the browser
  if (evt.key === "Tab") {
    return;
  }

  evt.preventDefault();
  evt.stopPropagation();

  const containingTabList = evt.currentTarget.parentElement?.parentElement;

  if (containingTabList?.role !== "tablist") {
    throw new Error("Broken structure, unable to proceed");
  }

  /**
   * @type {NodeListOf<HTMLButtonElement>} tabButtons The buttons in the tab list.
   */
  const tabButtons = containingTabList.querySelectorAll('[role="tab"] button');

  // Useful names for the indices
  const first = 0,
    last = tabButtons.length - 1,
    next = index + 1,
    previous = index - 1;

  // With the default prevented, the "click" equivalent needs to be triggered
  if (evt.key === "Enter" || evt.key === " " || evt.code === "Space") {
    evt.currentTarget.click();
  }
  // Otherwise handle the navigation:
  // Going to the first tab
  else if (evt.key === "Home" || (evt.key === "ArrowLeft" && evt.metaKey)) {
    focusAndScroll(tabButtons[first]);
  }
  // Or going to the last tab
  else if (evt.key === "End" || (evt.key === "ArrowRight" && evt.metaKey)) {
    focusAndScroll(tabButtons[last]);
  }
  // Moving to the right (next tab)
  else if (evt.key === "ArrowRight") {
    if (next < tabButtons.length) {
      focusAndScroll(tabButtons[next]);
    }
    // Loop back to the start if the focus is at the end
    else {
      focusAndScroll(tabButtons[first]);
    }
  }
  // Moving to the left (previous tab)
  else if (evt.key === "ArrowLeft") {
    if (index > first) {
      focusAndScroll(tabButtons[previous]);
    }
    // Loop around to the end if the focus is at the start
    else {
      focusAndScroll(tabButtons[last]);
    }
  }
};

export { navigateTabs, focusAndScroll };
