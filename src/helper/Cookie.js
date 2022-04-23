class Cookie {
  constructor(key, value, durationInDays) {
    this.key = key;
    this.value = value;
    this.durationInDays = durationInDays;
  }

  set() {
    document.cookie = `${this.key}=${this.value}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;
  }

  getDurationDate() {
    return new Date(
      new Date().setDate(new Date().getDate() + this.durationInDays)
    );
  }
}

export default Cookie;
