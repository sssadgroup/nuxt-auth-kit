<template>
  <div class="auth-layout">
    <div class="auth-layout__left">
      <div class="auth-layout__form-inner">
        <slot />
      </div>
    </div>

    <div class="auth-layout__right">
      <img
        :src="quote.image || DEFAULT_IMAGE"
        :alt="quote.appName"
        class="auth-layout__bg-image"
      />
      <div class="auth-layout__overlay" />
      <div class="auth-layout__content">
        <div>
          <slot name="brand">
            <h1 class="auth-layout__app-name">{{ quote.appName }}</h1>
            <p class="auth-layout__app-tagline">{{ quote.appTagline }}</p>
          </slot>
        </div>
        <div class="auth-layout__quote-card">
          <div class="auth-layout__quote-mark">"</div>
          <blockquote class="auth-layout__quote-text">
            {{ quote.text }}
          </blockquote>
          <div class="auth-layout__quote-mark auth-layout__quote-mark--close">
            "
          </div>
          <div v-if="quote.author" class="auth-layout__quote-author">
            <div v-if="quote.avatar" class="auth-layout__avatar">
              <img :src="quote.avatar" :alt="quote.author" />
            </div>
            <div
              v-else
              class="auth-layout__avatar auth-layout__avatar--initial"
            >
              <span>{{ quote.author.charAt(0) }}</span>
            </div>
            <div>
              <p class="auth-layout__author-name">{{ quote.author }}</p>
              <p class="auth-layout__author-location">{{ quote.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg";

withDefaults(
  defineProps<{
    quote?: {
      text: string;
      author?: string;
      location?: string;
      avatar?: string;
      appName?: string;
      appTagline?: string;
      image?: string;
    };
  }>(),
  {
    quote: () => ({
      text: "Une expérience fluide et agréable. La plateforme rend tout si simple.",
      author: "3S Tech Group",
      location: "Dakar, Sénégal",
      appName: "3S-Auth",
      appTagline: "La solution simple pour gérer votre activité.",
      image: undefined,
    }),
  },
);
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}
.auth-layout__left {
  align-items: center;
  background-color: #eeeee6;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 55%;
  justify-content: center;
  padding: 3rem 2rem;
  width: 55%;
}
.auth-layout__form-inner {
  max-width: 420px;
  width: 100%;
}
.auth-layout__right {
  flex: 0 0 45%;
  overflow: hidden;
  position: relative;
  width: 45%;
}
@media (max-width: 1023px) {
  .auth-layout__right {
    display: none;
  }
  .auth-layout__left {
    flex: 0 0 100%;
    width: 100%;
  }
}
.auth-layout__bg-image {
  height: 100%;
  inset: 0;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  position: absolute;
  width: 100%;
}
.auth-layout__overlay {
  background: rgba(0, 0, 0, 0.52);
  inset: 0;
  position: absolute;
}
.auth-layout__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 3.5rem;
  position: relative;
  z-index: 10;
}
.auth-layout__app-name {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.5rem;
}
.auth-layout__app-tagline {
  color: hsla(0, 0%, 100%, 0.75);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}
.auth-layout__quote-card {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: hsla(0, 0%, 100%, 0.1);
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  border-radius: 1.5rem;
  padding: 2rem;
}
.auth-layout__quote-mark {
  color: #f59e0b;
  font-family: Georgia, serif;
  font-size: 3rem;
  line-height: 1;
}
.auth-layout__quote-mark--close {
  margin-bottom: 1.25rem;
  text-align: right;
}
.auth-layout__quote-text {
  color: #fff;
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.65;
  margin: 0.25rem 0;
}
.auth-layout__quote-author {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
.auth-layout__avatar {
  border-radius: 50%;
  flex-shrink: 0;
  height: 2.75rem;
  overflow: hidden;
  width: 2.75rem;
}
.auth-layout__avatar img {
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
}
.auth-layout__avatar--initial {
  align-items: center;
  background: hsla(0, 0%, 100%, 0.2);
  display: flex;
  justify-content: center;
}
.auth-layout__avatar--initial span {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}
.auth-layout__author-name {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}
.auth-layout__author-location {
  color: hsla(0, 0%, 100%, 0.55);
  font-size: 0.8rem;
  margin: 0;
}
</style>
