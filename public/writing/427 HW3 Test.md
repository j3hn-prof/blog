 # HW3 — Probing & Static Analysis

**Posted:** Monday, September 21 · **Due:** Sunday, September 27 at 11:59 PM

In this assignment you will probe the JSON parsing library that **StockApp** depends on, turn on real static analysis for the project and fix what it finds, and then implement one more **AnalyticsComputor** API — with test coverage, and without introducing any new static analysis warnings.

> **NOTE:** Unlike HW2, this assignment **does** ask you to change implementation code (`src/main/*`) as well as test code.

You will submit this assignment by creating a GitHub Pull Request against your fork of the base repo, just as you did in HW2.

Parts of this assignment ask you to explain things in writing. Answer those as part of the description of your Pull Request (PR). For example:

<img src="/home/j3hn/Documents/VimesPrep/tictactoe/public/writing/example-pr.png" alt="An example PR whose description answers each problem's written questions" width="700">

**A detailed template specific to this assignment is included at the very end.**

> **Oral examination:** this assignment includes a 10 minute oral examination about your work, and your submission score is multiplied by how well it goes. The full question bank and rubric are at the end of this document — read them before you sign up for a slot.

Good luck! And please ask any questions in our Slack **#hw3** room.

## Getting Ready Best Practice

Same as always — start from a clean, current `main` and branch from there:

1. `git fetch`
2. `git checkout main`
3. `git pull`
4. `./gradlew clean build` — confirm latest `main` builds for you

Then create your branch:

1. `git branch hw3`
2. `git checkout hw3`

Commit incremental progress with `git commit -a -m "description of incremental progress"`.

## Problem 1 — JSON Parsing Probe (30 points)

In Lecture 3 we talked about **probing** as a way to understand a third-party library empirically rather than by reading its documentation. You have a library worth probing: [json-simple](https://code.google.com/archive/p/json-simple/), which **StockApp** uses to handle every WebSocket response it receives from Finnhub.

JSON parsing in a strongly typed language like Java is always a little awkward, because JSON is schema-less. An arbitrary JSON string might be an array of dictionaries, or a dictionary whose values are sometimes strings, sometimes numbers, sometimes more dictionaries. Parsing it in Java means casting objects into whatever shape you expect. **Probing is how you find out what shapes you actually get.**

Start by adding this class to `edu.bu` in your `src/test/java` folder:

```java
package edu.bu;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.tinylog.Logger;

@Tag("Probe")
public class JSONProbe {

  static final String PROBE_STRING =
      "{\"data\":" + "[" + "{\"p\":215,\"s\":\"AAPL\",\"t\":1704067200000,\"v\":1}," + "]" + "}";

  @Test
  public void jsonProbe() throws ParseException {
    // TODO: implement
    System.out.println(PROBE_STRING);
  }

  @Test
  public void jsonProbe_noPrice() throws ParseException {
    // TODO: implement
  }

  @Test
  public void jsonProbe_forceThrow() throws ParseException {
    // TODO: implement
  }
}
```

The `@Tag("Probe")` annotation lets you run these from JUnit while keeping them **out of** the test suite — `build.gradle` excludes that tag from the `test` task. Look at the `test` block in `build.gradle` and confirm you can see why.

> This is the Lecture 3 idea in its purest form: JUnit used purely as an **execution entry point**, not as a test.

### 1.1 Extract Price from a Single Response (15 points)

A real Finnhub response looks like this ([Finnhub docs](https://finnhub.io/docs/api/websocket-trades)):

```json
{
   "data":
     [
        {"p":214.74,"s":"AAPL","t":1723221240644,"v":300},
        {"p":197.58,"s":"TSLA","t":1723221240721,"v":94}
     ],
   "type":"trade"
}
```

Breaking that down — it is a dictionary where:

- `data` maps to an **array**
- each element of that array is itself a **dictionary** representing one trade, where
  - `p` is the price
  - `s` is the stock symbol
  - `t` is the trade time in [milliseconds since epoch](https://www.epochconverter.com/)
  - `v` is the trade volume
- `type` is Finnhub metadata

Implement `jsonProbe` so that it prints, via `System.out.println`, the **price** parsed out of the single data point in `PROBE_STRING`.

Use breakpoints in IntelliJ to inspect what `json-simple` actually hands back at each step so you know what to cast to. `.getClass()` on any Java object prints its class name, which is often faster than guessing.

### 1.2 Corruption — No Price (8 points)

Responses get corrupted — by a bug upstream, or in transit.

Implement `jsonProbe_noPrice` to run the same parsing code against an input string that is missing the `p` key in the trade dictionary.

**In your PR:** what does your probe code do when the price is missing? Be specific about *where* it fails and *what* you get back.

### 1.3 ParseException (7 points)

Part of probing a library is learning when and how it throws.

Implement `jsonProbe_forceThrow` so that the String you pass to `.parse()` causes `JSONParser` to throw a `ParseException`.

**In your PR:** why does your String cause the exception? If this were production code receiving that string off a live socket, what would you do so that the exception does not take down your process?

## Problem 2 — Static Analysis: Turning It On and Cleaning Up (30 points)

In Lecture 4 we talked about analyzing code **without running it**. There are many static analysis tools, including one built into IntelliJ. To give you something that runs both from the command line and in the IDE, we use [PMD](https://docs.pmd-code.org/pmd-doc-7.0.0/index.html) for this class.

PMD is already configured in your `build.gradle`, with two gradle tasks of its own: **`pmdMain`** (analyzes `src/main`) and **`pmdTest`** (analyzes `src/test`). Both already run as part of the top-level `build` task — they have been running all semester, configured to look for exactly one rule.

Now we turn on the rest.

### 2.1 Address the PMD Findings (20 points)

In `build.gradle`, uncomment every commented rule in the `pmdMain` block:

```groovy
	pmdMain {
		rulesMinimumPriority = 4
		ruleSets = [
//				"category/java/design.xml/AvoidDeeplyNestedIfStmts",
//				"category/java/design.xml/CollapsibleIfStatements",
//				"category/java/design.xml/CognitiveComplexity",
//				"category/java/design.xml/CyclomaticComplexity",
//				"category/java/bestpractices.xml/UnusedLocalVariable",
//				"category/java/codestyle.xml/ShortVariable",
//				"category/java/codestyle.xml/UseDiamondOperator",
//				"category/java/errorprone.xml/BrokenNullCheck",
//				"category/java/errorprone.xml/CloseResource",
//				"category/java/errorprone.xml/CompareObjectsWithEquals",
//				"category/java/errorprone.xml/ReturnEmptyCollectionRatherThanNull",
				"category/java/performance.xml/AvoidArrayLoops"
		]
//		ruleSetFiles(files("pmdruleset.xml"))
	}
```

Leave the `ruleSetFiles` line commented.

There is documentation for every rule [here](https://docs.pmd-code.org/pmd-doc-7.0.0/pmd_rules_java.html).

Then run `./gradlew clean pmdMain` (or `./gradlew clean build`). **It should fail with three violations**, in three different files.

Fix all three so that `./gradlew clean pmdMain` passes.

> Read each finding before you change anything. Two of the three are real defects waiting to happen; one is closer to a style preference. Part of the point of this problem is telling them apart — you will be asked about this in the oral examination.

### 2.2 Benefits of Static Analysis (5 points)

**In your PR:** now that you have fixed them, what do you think the benefit of having these rules enabled on this code base is? Pick the finding you thought was most valuable and say why.

### 2.3 Too Many Rules (5 points)

You can enable entire categories at once. Replacing an individual rule with:

```groovy
"category/java/design.xml"
```

turns on every rule in the `design` set. Try it and see what happens.

**In your PR:** what are the trade-offs of enabling all, or simply too many, of the rules? What happens to a team that ships a build where the analyzer reports fifty warnings on every run?

> Revert this experiment before you submit — your PR should have only the rules from 2.1 enabled.

## Problem 3 — Implementing a New Analytics Computation (40 points)

In HW2 you added test coverage for `mostActiveStock`. Now you will implement a variant of it that takes a time range and computes the most active stock **constrained to the data points in that range**.

```java
  /**
   * @param startTime inclusive start of the window of interest
   * @param endTime inclusive end of the window of interest
   * @return of all the stocks the data store is aware of, the symbol of the stock that has
   *     recorded the highest total trade volume between startTime and endTime, inclusive.
   */
  public String mostActiveStock(Instant startTime, Instant endTime) {
    // TODO: implement
    return "TODO";
  }
```

> **Read this before you start.** Your test classes declare their field as the **interface** type:
> ```java
> AnalyticsComputor analyticsComputor;
> ```
> So adding this method only to `BasicAnalyticsComputor` will not compile once your tests call it. You need to add it to the **`AnalyticsComputor` interface** as well as implement it in **`BasicAnalyticsComputor`**. Think about why that is — it is a good oral examination answer.

### 3.1 Implementation (15 points)

Implement the method in `BasicAnalyticsComputor`, and declare it on the `AnalyticsComputor` interface.

The existing `mostActiveStock` uses [Java streams](https://www.oracle.com/technical-resources/articles/java/ma14-java-se-8-streams.html). You are welcome to use streams here too, but if that feels like a lot right now, an ordinary loop is completely fine:

```java
for (String symbol : knownSymbols()) {
}
```

Use the debugging techniques from Lecture 3 — breakpoints and `System.out.println` — while you work.

### 3.2 Test Coverage (15 points)

Add coverage for your new method. Pick **either** `BasicAnalyticsComputorTest` or `BasicAnalyticsComputorTestWithMock` and add test methods named `mostActiveStockInWindow_*`.

Use the IntelliJ coverage tool to confirm your tests cover **100% of the lines** in your new method.

Think hard about the window boundaries. `startTime` and `endTime` are documented as inclusive — make sure at least one of your tests would fail if someone changed an `<=` to a `<`.

### 3.3 Static Analysis (5 points)

Confirm that your new code has not introduced any new PMD warnings. If it has, fix them.

### 3.4 New Method Invocation (5 points)

**In your PR:** is the method you just implemented reachable through the HTTP API that **StockApp** exposes? Why or why not? What would it take to make it reachable?

## Submitting this assignment

Same as HW2. Make sure everything is committed with `git commit -a -m "<description>"`, and check `git status` for anything outstanding.

Before pushing, run `./gradlew preCommit`. It cleans, reformats, compiles, runs static analysis, and executes the unit tests. If it passes, your branch is in good shape.

Push with `git push --set-upstream origin hw3`, or just `git push` if the branch already exists remotely.

Then create a Pull Request from GitHub by clicking **Compare & pull request** for your new branch.

> **IMPORTANT: make sure the base of the pull request is your fork and not the base for the class.** Throughout this course you only create Pull Requests against, and merge code into, your own repository.

Remember to invite the `staff` team as a reviewer.

### GitHub Pull Request Template for this Assignment

```markdown
## Problem 1 — JSON Parsing Probe
### Problem 1.2 — Corruption, no price

Response here

### Problem 1.3 — ParseException

Response here

## Problem 2 — Static Analysis
### Problem 2.2 — Benefits of Static Analysis

Response here

### Problem 2.3 — Too Many Rules

Response here

## Problem 3 — A New Analytics Computation
### Problem 3.4 — New Method Invocation

Response here
```

## Oral Examination — Questions and Rubric

A **10 minute conversation** with the TA or the instructor during the week after the deadline, producing a **multiplier between 0.0 and 1.0** applied to your submission score.

Same format as HW2. Nothing here is a secret — read it before you sign up.

### What the conversation looks like

You will be asked **three questions**, all anchored in **the code you actually submitted**. We will have your Pull Request open in front of us.

**Question 1 — Walk us through something you built.**

We pick one of: your `JSONProbe` methods, one of the three PMD fixes, or your windowed `mostActiveStock` and its tests. **We pick it, not you.** Be ready to say what it does, why you did it that way, and what you tried that did not work.

**Question 2 — A decision you made.**

Something specific in your code or your PR write-up. Why you cast the way you did in the probe; why you fixed a PMD finding the way you fixed it; which window boundary cases you chose to test and which you left out.

**Question 3 — A concept from the bank, tied back to your code.**

From the bank below, and we will ask you to point at the line in your submission where it applies.

### Question bank

1. Walk us through `jsonProbe`. What types did `json-simple` actually hand back at each step, and how did you find out?
2. In `jsonProbe_noPrice`, exactly where did it fail and what did you get back? Was that the failure you expected?
3. What String made `JSONParser` throw, and why that one?
4. What does `@Tag("Probe")` do? Find the line in `build.gradle` that gives it meaning, and explain why we would want a JUnit class that never runs in the suite.
5. Pick one of the three PMD findings you fixed. What could actually go wrong in production if it were left alone?
6. Which of the three was closest to a style preference rather than a defect, and how did you decide?
7. `ReturnEmptyCollectionRatherThanNull` — why is returning `null` worse than returning an empty list, for the caller?
8. Walk us through your windowed `mostActiveStock`. What happens when the window contains no data points at all?
9. `startTime` and `endTime` are inclusive. Which of your tests would fail if someone changed `<=` to `<`? Show us.
10. Why did adding the method to `BasicAnalyticsComputor` alone not compile? What does that tell you about what the interface is for?
11. What can PMD prove about your code that a test cannot — and what can a test prove that PMD cannot?
12. Suppose an assistant had fixed all three PMD findings for you. What would you check before merging that, and what would you not be able to check?

### How your multiplier is calculated

You start at **1.0**.

- **Answer all three questions well → 1.0.**
- **If you cannot answer a question, we ask a follow-up** — a smaller, more concrete version of the same question. Answer that well and you lose only **0.05** for that part.
- **If you can answer neither the question nor the follow-up, you lose 0.33** for that part.

The multiplier never goes below 0.0.

| What happened | Multiplier |
| --- | --- |
| All three answered well | **1.00** |
| Two answered well, one recovered on the follow-up | **0.95** |
| One answered well, two recovered on follow-ups | **0.90** |
| All three recovered on follow-ups | **0.85** |
| Two answered well, one missed entirely | **0.67** |
| One answered well, one recovered, one missed entirely | **0.62** |
| One answered well, two missed entirely | **0.34** |
| All three missed entirely | **0.00** |

### What "answered well" means

You do not need to be word perfect, and you will not be marked down for pausing to think or re-reading your own code. We are checking that you can explain **your own submission** and reason about it:

- you can navigate your code and describe what it does without guessing
- you can explain *why* you made a choice, not just *what* the code does
- you can reason about a condition the assignment did not ask you to handle

> **A note on AI assistance:** the [AI / LLM Policy](../../SYLLABUS.md#ai--llm-policy) applies to this assignment. The oral examination is where that policy has teeth. If you cannot explain code that appears under your name, the multiplier is where it shows up — regardless of whether the submission passes every automated check.
