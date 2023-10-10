<script setup>
import {onCreated, onMounted, onUnmounted} from 'vue'


const newTag = ref(null);
const tagsCopy = ref(null);
const tagsEditStatus = ref(null);
const deletionMark = ref(null);
const deletionMarkTime = ref(null);
const selectedItem = ref(null);
const focused = ref(null);

const autocompleteOpen = computed(() => {
  if (props.autocompleteAlwaysOpen) return true;
  return (
    newTag !== null &&
    newTag.length >= props.autocompleteMinLength &&
    filteredAutocompleteItems.length > 0 &&
    focused
  );
});

const filteredAutocompleteItems = computed(() => {
  const is = props.autocompleteItems.map((i) => {
    return createTag(i, props.tags, props.validation, props.isDuplicate);
  });

  if (!autocompleteFilterDuplicates) return is;
  return is.filter(duplicateFilter);
});

const createTags = (tags, ...rest) => tags.map((t) => createTag(t, tags, ...rest));

const createTag = (tag, ...rest) => {
  // if text is undefined, a string is passed. let's make a tag out of it
  if (tag.text === undefined) tag = { text: tag };

  // we better make a clone to not getting reference trouble
  const t = clone(tag);

  // create the validation classes
  t.tiClasses = createClasses(tag, ...rest);
  return t;
};

const validateUserRules = (tag, validation) => {
  return validation
    .filter((val) => {
      const { text } = tag;
      // if the rule is a string, we convert it to RegExp
      if (typeof val.rule === "string") return !new RegExp(val.rule).test(text);

      if (val.rule instanceof RegExp) return !val.rule.test(text);

      // if we deal with a function, invoke it
      const isFunction = {}.toString.call(val.rule) === "[object Function]";
      if (isFunction) return val.rule(tag);
    })
    .map((val) => val.classes);
};

const clone = (node) => JSON.parse(JSON.stringify(node));

const findIndex = (arr, callback) => {
  let index = 0;
  while (index < arr.length) {
    if (callback(arr[index], index, arr)) return index;
    index++;
  }
  return -1;
};

const createClasses = (tag, tags, validation = [], customDuplicateFn) => {
  if (tag.text === undefined) tag = { text: tag };

  // create css classes from the user validation array
  const classes = validateUserRules(tag, validation);

  // if we find the tag, it's an exsting one which is edited.
  // in this case we must splice it out
  const index = findIndex(tags, (t) => t === tag);
  const tagsDiff = clone(tags);
  const inputTag = index !== -1 ? tagsDiff.splice(index, 1)[0] : clone(tag);

  // check whether the tag is a duplicate or not
  const duplicate = customDuplicateFn
    ? customDuplicateFn(tagsDiff, inputTag)
    : tagsDiff.map((t) => t.text).indexOf(inputTag.text) !== -1;

  // if it's a duplicate, push the class duplicate to the array
  if (duplicate) classes.push("ti-duplicate");

  // if we find no classes, the tag is valid → push the class valid
  classes.length === 0 ? classes.push("ti-valid") : classes.push("ti-invalid");
  return classes;
};

const propValidatorTag = (value) => {
  return !value.some((t) => {
    const invalidText = !t.text;
    if (invalidText) console.warn('Missing property "text"', t);

    let invalidClasses = false;
    if (t.classes) invalidClasses = typeof t.classes !== "string";
    if (invalidClasses)
      console.warn('Property "classes" must be type of string', t);

    return invalidText || invalidClasses;
  });
};



const props = defineProps({
  /**
   * @description Property to bind a model to the input.
     If the user changes the input value, the model updates, too.
     If the user presses enter with an valid input,
     a new tag is created with the value of this model.
     After creating the new tag, the model is cleared.
   * @property {props}
   * @required
   * @type {String}
   * @model
   * @default ''
   */
  value: {
    type: String,
    default: "",
    required: true,
  },
  /**
   * @description Pass an array containing objects like in the example below.
     The properties 'style' and 'class' are optional. Of course it is possible to add custom
     properties to a tag object. vue-tags-input won't change the key and value.
   * @property {props}
   * @type {Array}
   * @sync
   * @default []
   * @example
    {
    &emsp;text: 'My tag value', &#47;* The visible text on display *&#47;
    &emsp;style: 'background-color: #ccc', &#47;* Adding inline styles is possible *&#47;
    &emsp;classes: 'custom-class another', &#47;* The value will be added as css classes *&#47;
    }
   */
  tags: {
    type: Array,
    default: () => []
  },
  /**
   * @description Expects an array containing objects inside. The objects
    can have the same properties as a tag object.
   * @property {props}
   * @type {Array}
   * @default []
   */
  autocompleteItems: {
    type: Array,
    default: () => []
  },
  /**
   * @description Defines whether a tag is editable after creation or not.
   * @property {props}
   * @type {Boolean}
   * @default false
   */
  allowEditTags: {
    type: Boolean,
    default: false,
  },
  /**
   * @description Defines if duplicate autocomplete items are filtered out from the view or not.
   * @property {props}
   * @type {Boolean}
   * @default true
   */
  autocompleteFilterDuplicates: {
    default: true,
    type: Boolean,
  },
  /**
   * @description If it's true, the user can add tags only via the autocomplete layer.
   * @property {props}
   * @type {Boolean}
   * @default false
   */
  addOnlyFromAutocomplete: {
    type: Boolean,
    default: false,
  },
  /**
   * @description The minimum character length which is required
     until the autocomplete layer is shown. If set to 0,
     then it'll be shown on focus.
   * @property {props}
   * @type {Number}
   * @default 1
   */
  autocompleteMinLength: {
    type: Number,
    default: 1,
  },
  /**
   * @description If it's true, the autocomplete layer is always shown, regardless if
     an input or an autocomplete items exists.
   * @property {props}
   * @type {Boolean}
   * @default false
   */
  autocompleteAlwaysOpen: {
    type: Boolean,
    default: false,
  },
  /**
   * @description Property to disable vue-tags-input.
   * @property {props}
   * @type {Boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @description The placeholder text which is shown in the input, when it's empty.
   * @property {props}
   * @type {String}
   * @default Add Tag
   */
  placeholder: {
    type: String,
    default: "Add Tag",
  },
  /**
   * @description Custom trigger key codes can be registrated. If the user presses one of these,
     a tag will be generated out of the input value. Can be either a numeric keyCode or the key
     as a string.
   * @property {props}
   * @type {Array}
   * @default [13]
   * @example add-on-key="[13, ':', ';']"
   */
  addOnKey: {
    type: Array,
    default: () => [13]
  },
  /**
   * @description Custom trigger key codes can be registrated. If the user edits a tag
     and presses one of these, the edited tag will be saved.
     Can be either a numeric keyCode or the key as a string.
   * @property {props}
   * @type {Array}
   * @default [13]
   * @example save-on-key="[13, ':', ';']"
   */
  saveOnKey: {
    type: Array,
    default: () => [13]
  },
  /**
   * @description The maximum amount the tags array is allowed to hold.
   * @property {props}
   * @type {Number}
   */
  maxTags: {
    type: Number,
  },
  /**
   * @description The maximum amount of characters the input is allowed to hold.
   * @property {props}
   * @type {Number}
   */
  maxlength: {
    type: Number,
  },
  /**
   * @description Pass an array containing objects like in the example below.
     The property 'classes' will be added as css classes, if the property 'rule' matches the text
     of a tag, an autocomplete item or the input. The property 'rule' can be type of
     RegExp or function. If the property 'disableAdd' is 'true', the item can't be added
     to the tags array, if the appropriated rule matches.
   * @property {props}
   * @type {Array}
   * @default []
   * @example
    {
    &ensp;classes: 'class', &#47;* css class *&#47;
    &ensp;rule: /^([^0-9]*)$/, &#47;* RegExp *&#47;
    }, {
    &ensp;classes: 'no-braces', &#47;* css class *&#47;
    &ensp;rule(text) { &#47;* function with text as param *&#47;
    &ensp;&ensp;return text.indexOf('{') !== -1 || text.indexOf('}') !== -1;
    &ensp;},
    &ensp;disableAdd: true, &#47;* if the rule matches, the item cannot be added *&#47;,
    },
   */
  validation: {
    type: Array,
    default: () => [],
    validator(value) {
      return !value.some((v) => {
        const missingRule = !v.rule;
        if (missingRule) console.warn('Property "rule" is missing', v);

        const validRule =
          v.rule &&
          (typeof v.rule === "string" ||
            v.rule instanceof RegExp ||
            {}.toString.call(v.rule) === "[object Function]");

        if (!validRule) {
          console.warn(
            "A rule must be type of string, RegExp or function. Found:",
            JSON.stringify(v.rule)
          );
        }

        const missingClasses = !v.classes;
        if (missingClasses) console.warn('Property "classes" is missing', v);

        const invalidType = v.type && typeof v.type !== "string";
        if (invalidType)
          console.warn('Property "type" must be type of string. Found:', v);

        return !validRule || missingRule || missingClasses || invalidType;
      });
    },
  },
  /**
   * @description Defines the characters which splits a text into different pieces,
     to generate tags out of this pieces.
   * @property {props}
   * @type {Array}
   * @default [';']
   * @example
     separators: [';', ',']
     input: some; user input, has random; commas, an,d semicolons
     will split into: some - user input - has random - commas - an - d semicolons
   */
  separators: {
    type: Array,
    default: () => [";"],
    validator(value) {
      return !value.some((s) => {
        const invalidType = typeof s !== "string";
        if (invalidType)
          console.warn("Separators must be type of string. Found:", s);
        return invalidType;
      });
    },
  },
  /**
   * @description If it's true, the user can't add or save a tag,
     if another exists, with the same text value.
   * @property {props}
   * @type {Boolean}
   * @default true
   */
  avoidAddingDuplicates: {
    type: Boolean,
    default: true,
  },
  /**
   * @description If the input holds a value and loses the focus,
     a tag will be generated out of this value, if possible.
   * @property {props}
   * @type {Boolean}
   * @default true
   */
  addOnBlur: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Custom function to detect duplicates. If the function returns 'true',
    the tag will be marked as duplicate.
   * @property {props}
   * @type {Function}
   * @param {Array} tagsarray The Array of tags minus the one which is edited/created.
   * @param {Object} tag The tag which is edited or should be added to the tags array.
   * @example
     // The duplicate function to recreate the default behaviour, would look like this:
     isDuplicate(tags, tag) {
     &ensp;return tags.map(t => t.text).indexOf(tag.text) !== -1;
    }
   */
  isDuplicate: {
    type: Function,
    default: null,
  },
  /**
   * @description If it's true, the user can paste into the input element and
     vue-tags-input will create tags out of the incoming text.
   * @property {props}
   * @type {Boolean}
   * @default true
   */
  addFromPaste: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Defines if it's possible to delete tags by pressing backspace.
     If so and the user wants to delete a tag,
     the tag gets the css class 'deletion-mark' for 1 second.
     If the user presses backspace again in that time period,
     the tag is removed from the tags array and the view.
   * @property {props}
   * @type {Boolean}
   * @default true
   */
  deleteOnBackspace: {
    default: true,
    type: Boolean,
  },
});

function getSelectedIndex(method) {
  const items = filteredAutocompleteItems;
  const selectedItem = selectedItem;
  const lastItem = items.length - 1;
  if (items.length === 0) return;
  if (selectedItem === null) return 0;
  if (method === "before" && selectedItem === 0) return lastItem;
  else if (method === "after" && selectedItem === lastItem) return 0;
  else return method === "after" ? selectedItem + 1 : selectedItem - 1;
}

function selectDefaultItem() {
  if (
    props.addOnlyFromAutocomplete &&
    filteredAutocompleteItems.length > 0
  ) {
    selectedItem = 0;
  } else selectedItem = null;
}

function selectItem(e, method) {
  e.preventDefault();
  selectedItem = getSelectedIndex(method);
}
function isSelected(index) {
  return selectedItem === index;
}
function isMarked(index) {
  return deletionMark === index;
}
// Method which is called when the user presses backspace → remove the last tag
function invokeDelete() {
  // If we shouldn't delete tags on backspace or we have some characters in the input → stop
  if (!props.deleteOnBackspace || tags.length > 0) return;
  const lastIndex = tagsCopy.length - 1;
  if (deletionMark === null) {
    deletionMarkTime = setTimeout(() => (deletionMark = null), 1000);
    deletionMark = lastIndex;
  } else performDeleteTag(lastIndex);
}
function addTagsFromPaste() {
  if (!props.addFromPaste) return;
  setTimeout(() => performAddTags(tags), 10);
}
// Method to call if a tag should switch to it's edit mode
function performEditTag(index) {
  if (!props.allowEditTags) return;
  if (!_events["before-editing-tag"]) editTag(index);
  /**
       * @description Emits before a tag toggles to it's edit mode
       * @name before-editing-tag
       * @property {events} hook
       * @returns {Object} Contains the to editing tag: 'tag'.
         The tag's index: 'index'. And a function: 'editTag'.
         If the function is invoked, the tag toggles to it's edit mode.
       */
  $emit("before-editing-tag", {
    index,
    tag: tagsCopy[index],
    editTag: () => editTag(index),
  });
}
// Opens the edit mode for a tag and focuses it
function editTag(index) {
  if (!props.allowEditTags) return;
  toggleEditMode(index);
  focus(index);
}
// Toggles the edit mode for a tag
function toggleEditMode(index) {
  if (!props.allowEditTags || props.disabled) return;
  $set(tagsEditStatus, index, !tagsEditStatus[index]);
}
// only called by the @input event from TagInput.
// Creates a new tag model and applys it to tagsCopy[index]
function createChangedTag(index, event) {
  // If the text of a tag changes → we create a new one with a new validation.
  // we take the value from the event if possible, because on google android phones
  // tagsCopy[index].text is incorrect, when typing a space on the virtual keyboard.
  // yes, this sucks ...
  const tag = tagsCopy[index];
  tag.text = event ? event.target.value : tagsCopy[index].text;
  $set(
    tagsCopy,
    index,
    createTag(tag, tagsCopy, props.validation, props.isDuplicate)
  );
}
// Focuses the input of a tag
function focus(index) {
  $nextTick(() => {
    const el = $refs.tagCenter[index].querySelector("input.ti-tag-input");
    if (el) el.focus();
  });
}
function quote(regex) {
  return regex.replace(/([()[{*+.$^\\|?])/g, "\\$1");
}
// Cancels the edit mode for a tag → resets the tag to it's original model!
function cancelEdit(index) {
  if (!props.tags[index]) return;
  tagsCopy[index] = clone(
    createTag(props.tags[index], props.tags, props.validation, props.isDuplicate)
  );
  $set(tagsEditStatus, index, false);
}
function hasForbiddingAddRule(tiClasses) {
  // Does the tag has a rule, defined by the user, which prohibits adding?
  return tiClasses.some((type) => {
    const rule = props.validation.find((rule) => type === rule.classes);
    return rule ? rule.disableAdd : false;
  });
}
// Creates multiple tags out of a string, based on the prop separators
function createTagTexts(string) {
  const regex = new RegExp(props.separators.map((s) => quote(s)).join("|"));
  return string.split(regex).map((text) => ({ text }));
}
// Method to call to delete a tag
function performDeleteTag(index) {
  if (!_events["before-deleting-tag"]) deleteTag(index);
  /**
       * @description Emits before a tag is deleted
       * @name before-deleting-tag
       * @property {events} hook
       * @returns {Object} Contains the to editing tag: 'tag'. The tag's index: 'index'
         And a function: 'deleteTag'. If the function is invoked, the tag is deleted.
       */
  $emit("before-deleting-tag", {
    index,
    tag: tagsCopy[index],
    deleteTag: () => deleteTag(index),
  });
}
function deleteTag(index) {
  if (props.disabled) return;
  deletionMark = null;

  // Clears the debounce for the deletion mark and removes the tag
  clearTimeout(deletionMarkTime);
  tagsCopy.splice(index, 1);

  // Special update for the parent if .sync is on
  if (_events["update:tags"]) $emit("update:tags", tagsCopy);

  /**
   * @description Emits if the tags array changes
   * @name tags-changed
   * @property {events}
   * @returns {Array} The modified tags array
   */
  $emit("tags-changed", tagsCopy);
}
// Decides wether the input keyCode is one, which is allowed to modify/add tags
function noTriggerKey(event, category) {
  const triggerKey =
    this[category].indexOf(event.keyCode) !== -1 ||
    this[category].indexOf(event.key) !== -1;
  if (triggerKey) event.preventDefault();
  return !triggerKey;
}
// Method to call to add a tag
function performAddTags(tag, event, source) {
  // If the input is disabled or the function was invoked by no trigger key → stop
  if (props.disabled || (event && noTriggerKey(event, "addOnKey"))) return;

  // Convert the string or object into a tags array
  let tags = [];
  if (typeof tag === "object") tags = [tag];
  if (typeof tag === "string") tags = createTagTexts(tag);

  // Filter out the tags with no content
  tags = tags.filter((tag) => tag.text.trim().length > 0);

  // The basic checks are done → try to add all tags
  tags.forEach((tag) => {
    tag = createTag(tag, props.tags, props.validation, props.isDuplicate);
    if (!_events["before-adding-tag"]) addTag(tag, source);
    /**
         * @description Emits before a tag is added
         * @name before-adding-tag
         * @property {events} hook
         * @returns {Object} Contains the to editing tag: 'tag'. And a function: 'addTag'.
           If the function is invoked, the tag is added.
         */
    $emit("before-adding-tag", {
      tag,
      addTag: () => addTag(tag, source),
    });
  });
}
function duplicateFilter(tag) {
  return props.isDuplicate
    ? !props.isDuplicate(tagsCopy, tag)
    : !tagsCopy.find((t) => t.text === tag.text);
}
function addTag(tag, source = "new-tag-input") {
  // Check if we should only add items from autocomplete and if so,
  // does the tag exists as an option
  const options = filteredAutocompleteItems.map((i) => i.text);
  if (props.addOnlyFromAutocomplete && options.indexOf(tag.text) === -1) return;

  // We use $nextTick here, because tagsCopy.length would be wrong if tags are added fast
  // like in a loop. With $nextTick we get the correct length value
  $nextTick(() => {
    // Maybe we should not add a tag because the maximum has reached already
    const maximumReached = props.maxTags && props.maxTags <= tagsCopy.length;

    /**
         * @description Emits if the maximum, the tags array is allowed to hold, is reached.
           The maximum can be defined by the prop 'max-tags'.
         * @name max-tags-reached
         * @property {events}
         * @returns {Object} The 'tag' which could not be added because of the length limitation.
         */
    if (maximumReached) return $emit("max-tags-reached", tag);

    // If we shouldn't add duplicates and that is one → stop
    const dup = props.avoidAddingDuplicates && !duplicateFilter(tag);
    /**
         * @description Emits if the user tries to add a duplicate to the tag's array
           and adding duplicates is prevented by the prop 'avoid-adding-duplicates'
         * @name adding-duplicate
         * @property {events}
         */
    if (dup) return $emit("adding-duplicate", tag);

    // If we find a rule which avoids that the tag is added → stop
    if (hasForbiddingAddRule(tag.tiClasses)) return;

    // Everything is okay → add the tag
    $emit("input", "");
    tagsCopy.push(tag);

    // Special update for the parent if .sync is on
    if (_events["update:tags"]) $emit("update:tags", tagsCopy);

    // if the tag was added by autocomplete, focus the input
    if (source === "autocomplete") $refs.newTagInput.focus();

    $emit("tags-changed", tagsCopy);
  });
}
// Method to call to save a tag
function performSaveTag(index, event) {
  const tag = tagsCopy[index];

  // If the input is disabled or the function was invoked by no trigger key → stop
  if (props.disabled || (event && noTriggerKey(event, "addOnKey"))) return;

  // If the tag has no content → stop
  if (tag.text.trim().length === 0) return;

  // The basic checks are done → try to save the tag
  if (!_events["before-saving-tag"]) saveTag(index, tag);
  /**
       * @description Emits before a tag is saved
       * @name before-saving-tag
       * @property {events} hook
       * @returns {Object} Contains the to editing tag: 'tag'.
         The tag's index: 'index'. And a function: 'saveTag'.
         If the function is invoked, the tag is saved.
       */
  $emit("before-saving-tag", {
    index,
    tag,
    saveTag: () => saveTag(index, tag),
  });
}
function saveTag(index, tag) {
  // If we shouldn't save duplicates → stop
  if (props.avoidAddingDuplicates) {
    const tagsDiff = clone(tagsCopy);
    const inputTag = tagsDiff.splice(index, 1)[0];
    const dup = props.isDuplicate
      ? props.isDuplicate(tagsDiff, inputTag)
      : tagsDiff.map((t) => t.text).indexOf(inputTag.text) !== -1;

    /**
         * @description Emits if the user tries to save a duplicate in the tag's array
           and saving duplicates is prevented by the prop 'avoid-adding-duplicates'
         * @name saving-duplicate
         * @property {events}
         */
    if (dup) return $emit("saving-duplicate", tag);
  }

  // If we find a rule which avoids that the tag is added → stop
  if (hasForbiddingAddRule(tag.tiClasses)) return;

  // Everything is okay → save the tag
  $set(tagsCopy, index, tag);
  toggleEditMode(index);

  // Special update for the parent if .sync is on
  if (_events["update:tags"]) $emit("update:tags", tagsCopy);

  $emit("tags-changed", tagsCopy);
}
function tagsEqual() {
  return !tagsCopy.some((t, i) => !equal(t, tags[i]));
}
function updateNewTag(ievent) {
  const value = ievent.target.value;
  tags = value;
  $emit("input", value);
}
function initTags() {
  // We always work with a copy of the "real" tags, to easier edit them
  tagsCopy = createTags(tags, props.validation, props.isDuplicate);

  // Let's create an array which defines whether a tag is in edit mode or not
  tagsEditStatus = clone(tags).map(() => false);

  // We check if the original and the copied and validated tags are equal →
  // Update the parent if not and sync is on.
  if (_events["update:tags"] && !tagsEqual()) {
    $emit("update:tags", tagsCopy);
  }
}
function blurredOnClick(e) {
  // if the click occurs on tagsinput → don't hide
  if ($el.contains(e.target) || $el.contains(document.activeElement))
    return;
  performBlur(e);
}
function performBlur() {
  // If we should add tags before blurring → add tag
  if (props.addOnBlur && focused) performAddTags(tags);

  // Hide autocomplete layer
  focused = false;
}

watch(value, async(newValue) => {
    if (!props.addOnlyFromAutocomplete) selectedItem = null;
    tags = newValue;
});

watch(tags, async() => {
    initTags();
})

watch(autocompleteOpen, async() => {
  if (
    props.addOnlyFromAutocomplete &&
    filteredAutocompleteItems.length > 0
  ) {
    selectedItem = 0;
  } else selectedItem = null;
})

onCreated(() => {
  tags = props.value;
  initTags();
})

onMounted(() => {
  selectDefaultItem();
  document.addEventListener("click", blurredOnClick);
})

onUnmounted(() => {
  document.removeEventListener("click", blurredOnClick);
})

</script>

<template>
  <div class="relative disabled:opacity-50">
    <div
      class="ti-input border-x-1 border-inherit border-solid flex px-2 flex-wrap"
    >
      <ul v-if="tagsCopy" class="ti-tags flex flex-wrap w-full leading-4">
        <li
          v-for="(tag, index) in tagsCopy"
          :key="index"
          :style="tag.style"
          :class="[
            { 'ti-editing': tagsEditStatus[index] },
            tag.tiClasses,
            tag.classes,
            { 'ti-deletion-mark': isMarked(index) },
          ]"
          tabindex="0"
          class="ti-tag"
          @click="$emit('tag-clicked', { tag, index })"
        >
          <div class="ti-content">
            <div v-if="$slots['tag-left']" class="ti-tag-left">
              <slot
                name="tag-left"
                :tag="tag"
                :index="index"
                :edit="tagsEditStatus[index]"
                :perform-save-edit="performSaveTag"
                :perform-delete="performDeleteTag"
                :perform-cancel-edit="cancelEdit"
                :perform-open-edit="performEditTag"
                :deletion-mark="isMarked(index)"
              />
            </div>
            <div ref="tagCenter" class="ti-tag-center">
              <span
                v-if="!$slots['tag-center']"
                :class="{ 'ti-hidden': tagsEditStatus[index] }"
                @click="performEditTag(index)"
                >{{ tag.text }}</span
              >
              <tag-input
                v-if="!$slots['tag-center']"
                :scope="{
                  edit: tagsEditStatus[index],
                  maxlength,
                  tag,
                  index,
                  validateTag: createChangedTag,
                  performCancelEdit: cancelEdit,
                  performSaveEdit: performSaveTag,
                }"
              />
              <slot
                name="tag-center"
                :tag="tag"
                :index="index"
                :maxlength="maxlength"
                :edit="tagsEditStatus[index]"
                :perform-save-edit="performSaveTag"
                :perform-delete="performDeleteTag"
                :perform-cancel-edit="cancelEdit"
                :validate-tag="createChangedTag"
                :perform-open-edit="performEditTag"
                :deletion-mark="isMarked(index)"
              />
            </div>
            <div v-if="$slots['tag-right']" class="ti-tag-right">
              <slot
                name="tag-right"
                :tag="tag"
                :index="index"
                :edit="tagsEditStatus[index]"
                :perform-save-edit="performSaveTag"
                :perform-delete="performDeleteTag"
                :perform-cancel-edit="cancelEdit"
                :perform-open-edit="performEditTag"
                :deletion-mark="isMarked(index)"
              />
            </div>
          </div>
          <div class="ti-actions">
            <!-- dont use v-if and v-else here -> different event calling on click?! -->
            <i
              v-if="!$slots['tag-actions']"
              v-show="tagsEditStatus[index]"
              class="ti-icon-undo"
              @click="cancelEdit(index)"
            />
            <i
              v-if="!$slots['tag-actions']"
              v-show="!tagsEditStatus[index]"
              class="ti-icon-close"
              @click="performDeleteTag(index)"
            />
            <slot
              v-if="$slots['tag-actions']"
              name="tag-actions"
              :tag="tag"
              :index="index"
              :edit="tagsEditStatus[index]"
              :perform-save-edit="performSaveTag"
              :perform-delete="performDeleteTag"
              :perform-cancel-edit="cancelEdit"
              :perform-open-edit="performEditTag"
              :deletion-mark="isMarked(index)"
            />
          </div>
        </li>
        <li class="ti-new-tag-input-wrapper">
          <input
            ref="newTagInput"
            v-bind="$attrs"
            :class="[createClasses(newTag, tags, validation, isDuplicate)]"
            :placeholder="placeholder"
            :value="newTag"
            :maxlength="maxlength"
            :disabled="disabled"
            type="text"
            size="1"
            class="ti-new-tag-input"
            @keydown="
              performAddTags(
                filteredAutocompleteItems[selectedItem] || newTag,
                $event
              )
            "
            @paste="addTagsFromPaste"
            @keydown.delete="invokeDelete"
            @keydown.tab="performBlur"
            @keydown.up="selectItem($event, 'before')"
            @keydown.down="selectItem($event, 'after')"
            @input="updateNewTag"
            @blur="$emit('blur', $event)"
            @focus="
              focused = true;
              $emit('focus', $event);
            "
            @click="addOnlyFromAutocomplete ? false : (selectedItem = null)"
          />
        </li>
      </ul>
    </div>
    <slot name="between-elements" />
    <div
      v-if="autocompleteOpen"
      class="ti-autocomplete"
      @mouseout="selectedItem = null"
    >
      <slot name="autocomplete-header" />
      <ul>
        <li
          v-for="(item, index) in filteredAutocompleteItems"
          :key="index"
          :style="item.style"
          :class="[
            item.tiClasses,
            item.classes,
            { 'ti-selected-item': isSelected(index) },
          ]"
          class="ti-item"
          @mouseover="disabled ? false : (selectedItem = index)"
        >
          <div
            v-if="!$slots['autocomplete-item']"
            @click="performAddTags(item, undefined, 'autocomplete')"
          >
            {{ item.text }}
          </div>
          <slot
            v-else
            name="autocomplete-item"
            :item="item"
            :index="index"
            :perform-add="
              (item) => performAddTags(item, undefined, 'autocomplete')
            "
            :selected="isSelected(index)"
          />
        </li>
      </ul>
      <slot name="autocomplete-footer" />
    </div>
  </div>
</template>