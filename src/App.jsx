import axios from "axios";
import { useState } from "react";

function App() {
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [ballMargin, setBallMargin] = useState("0px");
  const [fontFamilyList, setFontFamilyList] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(false);
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [nounVisibility, setNounVisibility] = useState(false);
  const [nounArray, setNounArray] = useState();
  const [synonymVisibility, setSynonymVisibility] = useState(false);
  const [synonym, setSynonym] = useState();
  const [verbVisibility, setVerbVisibility] = useState(false);
  const [verbArray, setVerbArray] = useState();
  const [sourceVisibility, setSourceVisibility] = useState(false);
  const [source, setSource] = useState();
  const [error, setError] = useState(false);

  //Ball Click Function
  const handleBallMargin = () => {
    if (ballMargin == "0px") {
      setBallMargin("19.5px");
    } else {
      setBallMargin("0px");
    }
  }; // <-- Ball Click Working Logic: If ball margin equals 0 pixel, the web is in daytime mode, and if it is not equal, it is in nighttime mode.

  const getData = async () => {
    try {
      const response = await axios.get(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + inputValue,
        (headers = {
          accept: "application/json",
          contentType: "application/json",
        })
      );

      //Word
      setWord(response.data[0].word);

      // Filter Phonetic Functions
      const filterPhonetic = await response.data[0].phonetics.filter(
        (phonetic) => {
          return (
            phonetic.hasOwnProperty("text") === true &&
            phonetic.hasOwnProperty("audio") === true
          );
        }
      );
      const filterTextAudio = await filterPhonetic.filter((phonetic) => {
        return phonetic.text !== "" && phonetic.audio !== "";
      });
      setPhonetic(filterTextAudio[0].text);
      setAudioSrc(filterTextAudio[0].audio);

      // Noun Visibility Function
      const filterMeaningsNoun = await response.data[0].meanings.filter(
        (meanings) => {
          return meanings.partOfSpeech === "noun";
        }
      );
      if (filterMeaningsNoun.length !== 0) {
        setNounVisibility(true);
        if (filterMeaningsNoun[0].definitions.length !== 0) {
          setNounArray(filterMeaningsNoun[0].definitions);
        }
      } else {
        setNounVisibility(false);
      }

      // Synonym Visibility Function
      if (response.data[0].meanings[0].synonyms.length !== 0) {
        setSynonym(response.data[0].meanings[0].synonyms[0]);
        setSynonymVisibility(true);
      } else {
        setSynonymVisibility(false);
      }

      // Verb Visibility Function
      const filterMeaningsVerb = await response.data[0].meanings.filter(
        (meanings) => {
          return meanings.partOfSpeech === "verb";
        }
      );
      if (filterMeaningsVerb.length !== 0) {
        setVerbVisibility(true);
        if (filterMeaningsVerb[0].definitions.length !== 0) {
          setVerbArray(filterMeaningsVerb[0].definitions);
        }
      } else {
        setVerbVisibility(false);
      }

      // Source Visibility Function
      if (response.data[0].sourceUrls.length !== 0) {
        setSource(response.data[0].sourceUrls[0]);
        setSourceVisibility(true);
      } else {
        setSourceVisibility(false);
      }

      // Result
      if (response.status !== 404) {
        setResult(true);
        setError(false);
      }
    } catch (error) {
      setResult(false);
      setError(true);
    }
  };

  return (
    <div
      className="App"
      style={{ backgroundColor: ballMargin == "0px" ? "#FFF" : "#050505" }}
    >
      {/* Header  */}
      <div className="header">
        {/* Left  */}
        <svg
          className="book-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 34"
          fill="none"
        >
          <path
            d="M0.25 29.0548C0.25 29.469 0.585786 29.8048 1 29.8048C1.41421 29.8048 1.75 29.469 1.75 29.0548H0.25ZM2.02713 2.02713L1.4968 1.4968L1.4968 1.4968L2.02713 2.02713ZM28.7466 1.30814L28.2163 1.83842L28.2164 1.83853L28.7466 1.30814ZM28.3048 25.0465C28.3048 25.4607 28.6406 25.7965 29.0548 25.7965C29.469 25.7965 29.8048 25.4607 29.8048 25.0465H28.3048ZM4.50685 24.7979C4.09264 24.7979 3.75685 25.1337 3.75685 25.5479C3.75685 25.9622 4.09264 26.2979 4.50685 26.2979V24.7979ZM29.0548 26.2979C29.469 26.2979 29.8048 25.9622 29.8048 25.5479C29.8048 25.1337 29.469 24.7979 29.0548 24.7979V26.2979ZM4.50685 31.8116C4.09264 31.8116 3.75685 32.1474 3.75685 32.5616C3.75685 32.9759 4.09264 33.3116 4.50685 33.3116V31.8116ZM29.0548 33.3116C29.469 33.3116 29.8048 32.9759 29.8048 32.5616C29.8048 32.1474 29.469 31.8116 29.0548 31.8116V33.3116ZM1.75 29.0548V4.50685H0.25V29.0548H1.75ZM1.75 4.50685C1.75 3.77569 2.04045 3.07447 2.55746 2.55746L1.4968 1.4968C0.698492 2.29512 0.25 3.37786 0.25 4.50685H1.75ZM2.55746 2.55746C3.07448 2.04045 3.77566 1.75 4.50685 1.75V0.25C3.37783 0.25 2.29512 0.698494 1.4968 1.4968L2.55746 2.55746ZM4.50685 1.75H28.0027V0.25H4.50685V1.75ZM28.0027 1.75C28.0829 1.75 28.1597 1.78183 28.2163 1.83842L29.277 0.777855C28.9391 0.439857 28.4807 0.25 28.0027 0.25V1.75ZM28.2164 1.83853C28.273 1.89513 28.3048 1.97191 28.3048 2.05205H29.8048C29.8048 1.57415 29.615 1.11575 29.2769 0.777749L28.2164 1.83853ZM28.3048 2.05205V25.0465H29.8048V2.05205H28.3048ZM4.50685 26.2979H29.0548V24.7979H4.50685V26.2979ZM4.50685 33.3116H29.0548V31.8116H4.50685V33.3116Z"
            fill="#757575"
          />
          <path
            d="M4.50685 32.5616C3.57675 32.5616 2.6848 32.1921 2.02713 31.5344C1.36947 30.8768 1 29.9848 1 29.0547C1 28.1246 1.36947 27.2326 2.02713 26.575C2.6848 25.9173 3.57675 25.5479 4.50685 25.5479"
            stroke="#757575"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.76709 8.0138H20.2876"
            stroke="#757575"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Right  */}
        <div className="right-div">
          {/* Font Family Changer */}
          <div className="font-family-div">
            <p
              style={{
                fontFamily: fontFamily,
                color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
              }}
            >
              {fontFamily}
            </p>
            <svg
              onClick={() => setFontFamilyList(!fontFamilyList)}
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="9"
              viewBox="0 0 13 9"
              fill="none"
            >
              <path d="M1 1L7 7L13 1" stroke="#A445ED" strokeWidth="1.5" />
            </svg>

            {/* Font Family List  */}
            {fontFamilyList && (
              <div
                className="font-family-list"
                style={{
                  backgroundColor: ballMargin == "0px" ? "#FFF" : "#1F1F1F",
                  color: ballMargin == "0px" ? "#2D2D2D" : "#FFFFFF",
                  boxShadow:
                    ballMargin == "0px"
                      ? "0px 5px 30px 0px rgba(0, 0, 0, 0.10)"
                      : " 0px 5px 30px 0px #A445ED",
                }}
              >
                <p
                  onClick={() => {
                    setFontFamily("sans-serif");
                    setFontFamilyList(!fontFamilyList);
                  }}
                  style={{ fontFamily: "sans-serif" }}
                  className="sans-serif"
                >
                  Sans Serif
                </p>
                <p
                  onClick={() => {
                    setFontFamily("serif");
                    setFontFamilyList(!fontFamilyList);
                  }}
                  style={{ fontFamily: "serif" }}
                  className="serif"
                >
                  Serif
                </p>
                <p
                  onClick={() => {
                    setFontFamily("monospace");
                    setFontFamilyList(!fontFamilyList);
                  }}
                  style={{ fontFamily: "monospace" }}
                  className="mono"
                >
                  Monospace
                </p>
              </div>
            )}
          </div>
          <hr
            style={{
              backgroundColor: ballMargin == "0px" ? "#E9E9E9" : "#FFF",
            }}
          />{" "}
          {/* <-- Border  */}
          {/* Day & Night Changer  */}
          <div className="day-night-div">
            <div
              className="day-night-changer"
              style={{
                backgroundColor: ballMargin == "0px" ? "#757575" : "#A445ED",
              }}
            >
              <div
                style={{ marginLeft: ballMargin }}
                onClick={() => handleBallMargin()}
              ></div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 10.449C0.998458 12.8283 1.80169 15.1383 3.27914 17.0033C4.75659 18.8683 6.82139 20.1788 9.13799 20.7218C11.4545 21.2647 13.8866 21.0082 16.039 19.994C18.1912 18.9797 19.9373 17.2673 20.9931 15.1352C11.5442 15.1352 6.85799 10.4479 6.85799 1C5.09842 1.87311 3.61767 3.22033 2.58266 4.88981C1.54765 6.5593 0.999502 8.48469 1 10.449Z"
                style={{ stroke: ballMargin == "0px" ? "#757575" : "#A445ED" }}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Input Container  */}
      <div className="input-parent-div">
        <div
          className="input-div"
          style={{
            backgroundColor: ballMargin == "0px" ? "#F4F4F4" : "#1F1F1F",
            borderColor: inputValue == "" ? "#FF5252" : "transparent",
          }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search for any word…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                backgroundColor: ballMargin == "0px" ? "#F4F4F4" : "#1F1F1F",
                color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
                fontFamily: fontFamily,
              }}
            />
          </form>

          {/* Search Button */}
          <div
            onClick={() => {
              inputValue !== "" ? getData() : null;
            }}
            className="search-div"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M13.193 12.1323C12.9001 11.8394 12.4252 11.8394 12.1323 12.1323C11.8394 12.4252 11.8394 12.9001 12.1323 13.193L13.193 12.1323ZM16.0199 17.0806C16.3128 17.3734 16.7877 17.3734 17.0806 17.0806C17.3734 16.7877 17.3734 16.3128 17.0806 16.0199L16.0199 17.0806ZM2.95195 12.3768L3.48231 11.8465L3.48226 11.8464L2.95195 12.3768ZM5.11403 13.8215L4.82696 14.5144L4.82704 14.5144L5.11403 13.8215ZM10.2147 13.8215L10.5017 14.5144L10.5018 14.5144L10.2147 13.8215ZM12.3768 12.3768L11.8465 11.8464L11.8464 11.8465L12.3768 12.3768ZM13.8215 10.2147L14.5144 10.5018L14.5144 10.5017L13.8215 10.2147ZM12.3768 2.95195L11.8464 3.48228L11.8465 3.4823L12.3768 2.95195ZM12.1323 13.193L16.0199 17.0806L17.0806 16.0199L13.193 12.1323L12.1323 13.193ZM0.25 7.66438C0.25 8.63802 0.441775 9.60213 0.814377 10.5017L2.20021 9.92773C1.90297 9.2101 1.75 8.44103 1.75 7.66438H0.25ZM0.814377 10.5017C1.18699 11.4014 1.73315 12.2187 2.42165 12.9071L3.48226 11.8464C2.93307 11.2973 2.49743 10.6453 2.20021 9.92773L0.814377 10.5017ZM2.4216 12.9071C3.11012 13.5957 3.92748 14.1417 4.82696 14.5144L5.40111 13.1286C4.68347 12.8313 4.03147 12.3957 3.48231 11.8465L2.4216 12.9071ZM4.82704 14.5144C5.72658 14.887 6.69075 15.0788 7.66438 15.0788V13.5788C6.88773 13.5788 6.1186 13.4258 5.40102 13.1286L4.82704 14.5144ZM7.66438 15.0788C8.63803 15.0788 9.60213 14.887 10.5017 14.5144L9.92776 13.1286C9.2101 13.4258 8.44102 13.5788 7.66438 13.5788V15.0788ZM10.5018 14.5144C11.4013 14.1417 12.2187 13.5956 12.9071 12.907L11.8464 11.8465C11.2973 12.3957 10.6453 12.8313 9.92767 13.1286L10.5018 14.5144ZM12.907 12.9071C13.5956 12.2187 14.1417 11.4013 14.5144 10.5018L13.1286 9.92767C12.8313 10.6453 12.3957 11.2973 11.8465 11.8464L12.907 12.9071ZM14.5144 10.5017C14.887 9.60213 15.0788 8.63803 15.0788 7.66438H13.5788C13.5788 8.44102 13.4258 9.2101 13.1286 9.92776L14.5144 10.5017ZM15.0788 7.66438C15.0788 5.69797 14.2977 3.81209 12.9071 2.4216L11.8465 3.4823C12.9557 4.59145 13.5788 6.09578 13.5788 7.66438H15.0788ZM12.9071 2.42163C11.5167 1.03116 9.6308 0.25 7.66438 0.25V1.75C9.23297 1.75 10.7373 2.37312 11.8464 3.48228L12.9071 2.42163ZM7.66438 0.25C5.69796 0.25 3.81209 1.03115 2.42162 2.42162L3.48228 3.48228C4.59145 2.37312 6.09579 1.75 7.66438 1.75V0.25ZM2.42162 2.42162C1.03115 3.81209 0.25 5.69796 0.25 7.66438H1.75C1.75 6.09579 2.37312 4.59145 3.48228 3.48228L2.42162 2.42162Z"
                fill="#A445ED"
              />
            </svg>
          </div>
        </div>
        {inputValue == "" ? (
          <p className="warning" style={{ fontFamily: fontFamily }}>
            Whoops, can’t be empty…
          </p>
        ) : null}
      </div>

      {/* Error Page  */}
      {error && (
        <div className="error-container">
          <p className="emoji">😕</p>
          <p
            className="not-found"
            style={{
              fontFamily: fontFamily,
              color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
            }}
          >
            No Definitions Found
          </p>
          <p className="sorry-message" style={{ fontFamily: fontFamily }}>
            Sorry pal, we couldn't find definitions for the word you were
            looking for. You can try the search again at later time or head to
            the web instead.
          </p>
        </div>
      )}

      {/* Result Page */}
      {result && (
        <div className="result">
          <div className="word-result">
            {/* Word  */}
            <div className="word-pronounce">
              <p
                style={{
                  fontFamily: fontFamily,
                  color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
                }}
                className="word"
              >
                {word}
              </p>
              <p className="word-saying-form">{phonetic}</p>
            </div>

            {/* Word Audio  */}
            <svg
              onClick={() => new Audio(audioSrc).play()}
              className="audio-player"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle opacity="0.25" cx="24" cy="24" r="24" fill="#A445ED" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 18V31L32 24.5L19 18Z"
                fill="#A445ED"
              />
            </svg>
          </div>

          {/* Noun  */}
          {nounVisibility && (
            <div className="noun-container">
              <div className="noun-verb">
                <p
                  style={{
                    fontFamily: fontFamily,
                    color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
                  }}
                >
                  noun
                </p>
                <hr
                  style={{
                    backgroundColor:
                      ballMargin == "0px" ? "#E9E9E9" : "#3A3A3A",
                  }}
                />
              </div>

              {/* Meaning  List */}
              {/* Noun Meaning  */}
              <p style={{ fontFamily: fontFamily }} className="meaning">
                Meaning
              </p>
              <div className="list-div">
                {nounArray.map((definition, index) => {
                  if (index < 3) {
                    return (
                      <div className="list-item" key={Math.random()}>
                        <li></li>
                        <p
                          style={{
                            fontFamily: fontFamily,
                            color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
                          }}
                        >
                          {definition.definition}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* Synonym  */}
          {synonymVisibility && (
            <div className="synonyms-div">
              <p style={{ fontFamily: fontFamily }} className="synonym-title">
                Synonyms
              </p>
              <p className="synonym" style={{ fontFamily: fontFamily }}>
                {synonym}
              </p>
            </div>
          )}

          {/* Verb  */}
          {verbVisibility && (
            <div className="verb-container">
              <div className="noun-verb">
                <p
                  style={{
                    fontFamily: fontFamily,
                    color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
                  }}
                >
                  Verb
                </p>
                <hr
                  style={{
                    backgroundColor:
                      ballMargin == "0px" ? "#E9E9E9" : "#3A3A3A",
                  }}
                />
              </div>

              {/* Verb Meaning  */}
              <p style={{ fontFamily: fontFamily }} className="meaning">
                Meaning
              </p>
              <div className="list-div">
                {verbArray.map((definition, index) => {
                  if (index < 3) {
                    return (
                      <div className="list-item" key={Math.random()}>
                        <li></li>
                        <p
                          style={{
                            fontFamily: fontFamily,
                            color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
                          }}
                        >
                          {definition.definition}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* Footer Border */}
          <hr
            className="footer-border"
            style={{
              backgroundColor: ballMargin == "0px" ? "#E9E9E9" : "#3A3A3A",
            }}
          />

          {/* Source  */}
          {sourceVisibility && (
            <div className="source-container">
              <p className="source" style={{ fontFamily: fontFamily }}>
                Source
              </p>
              <div className="source-div">
                <a
                  style={{
                    fontFamily: fontFamily,
                    color: ballMargin == "0px" ? "#2D2D2D" : "#FFF",
                  }}
                  target="_blank"
                  href={source}
                >
                  {source}
                </a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="14"
                  viewBox="0 0 13 14"
                  fill="none"
                >
                  <path
                    d="M6.09091 4.29545C6.50512 4.29545 6.84091 3.95967 6.84091 3.54545C6.84091 3.13124 6.50512 2.79545 6.09091 2.79545V4.29545ZM1.42603 3.97148L1.95635 4.50182L1.95637 4.50181L1.42603 3.97148ZM1.42603 12.574L1.95638 12.0437L1.95637 12.0436L1.42603 12.574ZM11.2045 7.90909C11.2045 7.49488 10.8688 7.15909 10.4545 7.15909C10.0403 7.15909 9.70455 7.49488 9.70455 7.90909H11.2045ZM4.83331 8.10603C4.54041 8.39893 4.54041 8.8738 4.83331 9.16669C5.1262 9.45959 5.60107 9.45959 5.89397 9.16669L4.83331 8.10603ZM13.1667 1.89397C13.4596 1.60107 13.4596 1.1262 13.1667 0.833306C12.8738 0.540413 12.3989 0.540413 12.106 0.833306L13.1667 1.89397ZM12.6364 2.11364C13.0506 2.11364 13.3864 1.77785 13.3864 1.36364C13.3864 0.949423 13.0506 0.613636 12.6364 0.613636V2.11364ZM9 0.613636C8.58579 0.613636 8.25 0.949423 8.25 1.36364C8.25 1.77785 8.58579 2.11364 9 2.11364V0.613636ZM13.3864 1.36364C13.3864 0.949423 13.0506 0.613636 12.6364 0.613636C12.2221 0.613636 11.8864 0.949423 11.8864 1.36364H13.3864ZM11.8864 5C11.8864 5.41421 12.2221 5.75 12.6364 5.75C13.0506 5.75 13.3864 5.41421 13.3864 5H11.8864ZM6.09091 2.79545H2.45455V4.29545H6.09091V2.79545ZM2.45455 2.79545C1.86987 2.79545 1.30913 3.02771 0.895692 3.44116L1.95637 4.50181C2.08849 4.36968 2.26769 4.29545 2.45455 4.29545V2.79545ZM0.895706 3.44115C0.482259 3.85458 0.25 4.41532 0.25 5H1.75C1.75 4.81314 1.82423 4.63394 1.95635 4.50182L0.895706 3.44115ZM0.25 5V11.5455H1.75V5H0.25ZM0.25 11.5455C0.25 12.1301 0.482269 12.6908 0.895685 13.1043L1.95637 12.0436C1.82422 11.9115 1.75 11.7323 1.75 11.5455H0.25ZM0.895678 13.1043C1.30913 13.5178 1.86988 13.75 2.45455 13.75V12.25C2.26768 12.25 2.08849 12.1758 1.95638 12.0437L0.895678 13.1043ZM2.45455 13.75H9V12.25H2.45455V13.75ZM9 13.75C9.58466 13.75 10.1454 13.5177 10.5588 13.1043L9.49818 12.0436C9.36603 12.1758 9.18683 12.25 9 12.25V13.75ZM10.5588 13.1043C10.9723 12.6908 11.2045 12.1301 11.2045 11.5455H9.70455C9.70455 11.7323 9.63033 11.9115 9.49818 12.0436L10.5588 13.1043ZM11.2045 11.5455V7.90909H9.70455V11.5455H11.2045ZM5.89397 9.16669L13.1667 1.89397L12.106 0.833306L4.83331 8.10603L5.89397 9.16669ZM12.6364 0.613636H9V2.11364H12.6364V0.613636ZM11.8864 1.36364V5H13.3864V1.36364H11.8864Z"
                    fill="#757575"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
