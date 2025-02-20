<template>
  <main>
    <section class="recent-section">
      <header>
        <h2>Recent Files</h2>
      </header>

      <rflex class="cards" v-if="files.length">
        <div v-if="!files">
          Here you will find all project related documents. Check back once the
          project is under way!
        </div>
        <dashboard-file-card
          v-for="(file, index) of files"
          @click="selectedDoc = file.url"
          :key="index"
          :file="file"
          :delete="false"
          :download="true"
        />
      </rflex>
    </section>

    <div class="files-section">
      <div class="grid-row" :class="{ 'show-preview': previewFile }">
        <div class="files-table-box card">
          <header>
            <h2>All Files</h2>
            <section class="search-section">
              <div class="input-box">
                <Icon icon="mdi-light:magnify" width="25" />
                <input
                  type="search"
                  placeholder="Search files..."
                  v-model="filters.search"
                />
              </div>
              <select name="" id="" v-model="filters.type">
                <option value="any">Any</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
            </section>
          </header>
          <table class="files-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Modified</th>
                <th>Size</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(file, index) in filteredFiles"
                :key="index"
                @click="previewFileIndex = index"
                :class="{ active: previewFileIndex === index }"
              >
                <td>
                  <Icon
                    v-if="file.type === 'document'"
                    icon="material-symbols:docs"
                    width="25px"
                  />
                  <Icon
                    v-if="file.type === 'image'"
                    icon="material-symbols:photo-camera-back-outline"
                    width="25px"
                  />
                </td>
                <td>{{ file.name }}.{{ file.extension }}</td>
                <td>
                  {{ dayjs(file.timestamp).format("dddd Do MMM HH:mma") }}
                </td>
                <td>{{ (file.size / 1024).toFixed(0) }}kb</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section class="file-preview card" v-if="previewFile">
          <header class="preview-header">
            <h3>File Preview</h3>
            <Icon
              icon="material-symbols:multimodal-hand-eye"
              width="25"
              v-modal="'doc-preview'"
            />
          </header>
          <embed
            v-if="previewFile.url"
            :src="previewFile.url"
            type="application/pdf"
          />
          <h3 class="file-name">
            {{ previewFile.name }}.{{ previewFile.extension }}
          </h3>

          <div class="description">
            <p>{{ previewFile.description }}</p>
            <p v-if="!previewFile.description">No description provided</p>
          </div>

          <div class="properties">
            <h4>Properties</h4>
            <div>Type: {{ previewFile.type }}</div>
            <div>
              Last Modified:
              {{ dayjs(previewFile.timestamp).format("dddd Do MMM HH:mma") }}
            </div>
            <div v-if="previewFile.size">
              Size: {{ (previewFile.size / 1024).toFixed(0) }}kb
            </div>
          </div>

          <!-- <pre>{{ previewFile }} </pre> -->
        </section>

        <modal class="doc-modal" id="doc-preview">
          <!-- <div class="content" v-if="previewFile.url"> -->
          <!--   <embed :src="previewFile.url" type="application/pdf" /> -->
          <!-- </div> -->
        </modal>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { Icon } from "@iconify/vue";
const previewFileIndex = ref<number>(0);
const filters: Ref<FileFilters> = ref({
  search: "",
  type: "any",
});

const previewFile = computed(() => {
  return filteredFiles.value[previewFileIndex.value];
});
const filteredFiles = computed(() => {
  return $Files.filterFiles(filters.value);
});

const files = computed(() => {
  return $Files.get;
});

const selectedDoc = ref("");

definePageMeta({
  layout: "dashboard",
  middleware: "dashboard",
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 25px;
  height: 100vh;
  padding-block: 25px;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.cards {
  align-items: start;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 25px;
}

header {
  display: flex;
  justify-content: space-between;
}

.card {
  border-radius: $border-radius;
  background: white;
  padding: 25px;
  box-shadow: 3px 3px 10px lightgrey;
}

.files-section {
  display: flex;
  flex-direction: column;
  height: 100%;

  header {
    padding-bottom: 25px;
  }

  .files-table-box {
    height: 100%;
    flex: 1;
    width: 100%;

    .search-section {
      display: flex;
      gap: 10px;

      .input-box {
        display: flex;
        align-items: center;
        gap: 5px;
        background: $text-light1;
        padding-inline: 15px;
        border-radius: 25px;

        input {
          border: none;
          padding-block: 10px;
          padding-inline: 0 2px;
          background: none;

          &:focus {
            outline: none;
          }
        }
      }
    }

    .files-table {
      text-align: left;
      height: min-content;
      width: 100%;

      thead {
        border-collapse: collapse;

        th {
          border-bottom: 1px solid black;
        }

        tr {
          border-collapse: collapse;
        }

        th,
        td {
          margin: 0;
          border-collapse: collapse;
          padding-right: 25px;
        }
      }

      th,
      td {
        border-bottom: 1px solid $secondary;
        border-collapse: collapse;
        padding-inline: 10px 50px;
        padding-block: 10px 10px;
      }

      td {
        text-align: left;
        vertical-align: center;
      }

      tr {
        border-collapse: collapse;

        &.active {
          background: $text-light1;
        }
      }
    }
  }

  cursor: pointer;
}

.grid-row {
  display: grid;
  grid-template-columns: 5fr;
  grid-gap: 25px;
  width: 100%;
  transition: all 0.15s;
  flex: 1;

  &.show-preview {
    grid-template-columns: 6fr 350px;
  }

  .file-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;

    header {
      padding-bottom: 15px;
    }

    .file-name {
      margin-block: 15px 5px;
    }

    .description {
      font-weight: 300;
      font-size: 0.9rem;
    }

    .properties {
      border-top: 1px solid $text-light2;
      padding-top: 25px;
      margin-top: 25px;

      display: flex;
      flex-direction: column;
      gap: 5px;

      h4 {
        margin-block: 5px;
      }
    }

    embed {
      max-width: 100%;
      min-height: 450px;
      border-bottom: 2px solid black;
      outline: 2px solid black;
      background: $secondary;
    }
  }
}

:deep(".content") {
  height: 100%;
  width: 500px;
}

.doc-modal {
  .content {
    height: 90%;
  }

  embed {
    height: 100%;
    width: 800px;
  }
}
</style>
