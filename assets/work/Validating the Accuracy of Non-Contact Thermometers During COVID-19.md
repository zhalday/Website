# Validating the Accuracy of Non-Contact Thermometers During COVID-19

## Client Context

During the COVID-19 pandemic, non-contact infrared thermometers became the primary screening tool for public access control.

They were deployed at:

- Hospitals
- Industrial facilities
- Corporate offices
- Retail environments
- Critical infrastructure sites

These devices were treated as authoritative screening instruments.

The central engineering question was:

> Are non-contact thermometers accurate enough to support screening decisions under real-world conditions?

Deep Field was engaged to evaluate device performance from a technical and measurement-science perspective.

---

## The Engineering Challenge

Infrared thermometers do not directly measure body temperature.

They measure infrared radiation and convert it into temperature using:

- Emissivity assumptions
- Internal algorithms
- Conversion factors

Human skin has an emissivity of approximately 0.98.

Accuracy depends on:

- Proper emissivity configuration
- Calibration quality
- Distance to subject
- Ambient temperature
- External radiation sources

Many widely used devices:

- Had unknown fixed emissivity values
- Claimed +/-0.2 C to +/-0.3 C accuracy
- Provided limited transparency on calibration methodology

In high-consequence environments, this level of uncertainty required formal evaluation.

---

## Deep Field Approach

We treated the problem as a measurement validation exercise, not a product review.

### 1) Controlled Calibration Reference

A black body calibrator was used as a temperature reference standard.

Why a black body?

Because it has:

- Known emissivity
- Precisely controlled temperature
- Stable radiative characteristics

This establishes a traceable reference condition.

### 2) Multi-Device Comparative Testing

Four devices were evaluated:

- Model 1: Human body measurement
- Model 2: Surface/object measurement
- Model 3: Human body measurement
- Model 4: Tympanic (ear) contact thermometer (control reference)

The black body was set between 30 C and 40 C.

For each setpoint:

- Multiple readings were recorded
- Measurement deltas were calculated
- Repeatability was assessed

---

## Results

### Accuracy

The findings were significant.

#### Model 1 and 3 (Common Screening Devices)

Worst-case error:

- +6 C at 30 C setpoint

Claimed accuracy:

- +/-0.3 C

Observed best-case real accuracy:

- +/-2.2 C

These devices consistently overshot the setpoint.

#### Model 2 (Surface Mode)

Worst-case error:

- -3.3 C at 40 C

This device consistently undershot the setpoint.

#### Model 4 (Tympanic - Control)

This device provided significantly higher accuracy but is not within the non-contact class.

### Repeatability

Despite poor absolute accuracy, repeatability was strong.

Worst-case variance on repeated measurements:

- 0.5 C

This means:

- Devices were consistently wrong
- But consistently wrong in a predictable way

This distinction is critical in measurement systems engineering.

### Variability Between Identical Devices

Two identical units of the same make and model were tested.

Variance observed:

- Up to 1.2 C

This indicates inter-device calibration differences introduce additional uncertainty.

### Thermal Surface Mapping Insight

Thermal imaging revealed significant surface temperature variation across the human body.

Measured apparent surface temperatures:

- Inner tear duct: 34.5 C
- Forehead: 33.5 C
- Neck: 32.8 C
- Hand: 30.8 C

The inner tear duct provides the closest approximation to core temperature.

Most handheld non-contact devices target the forehead.

Many appear to apply a fixed algorithmic offset to force readings into a normal body temperature range.

This likely explains their systematic overshoot behavior.

---

## System-Level Insight

This work was not just about thermometer accuracy. It exposed deeper issues.

### 1) Algorithmic Normalisation

Devices may be engineered to produce expected outputs rather than true surface temperatures.

### 2) Screening Decision Risk

If a device is +/-2 to 6 C inaccurate, then:

- False positives increase
- False negatives become possible
- Decision confidence drops

### 3) Measurement Context Sensitivity

Temperature readings vary based on:

- Distance to subject
- Ambient temperature
- External heat sources

Without controlled scanning conditions, accuracy degrades further.

---

## Recommendations

Deep Field recommended a systems-based mitigation approach:

- Use non-contact devices for trend detection, not single absolute readings
- Establish per-device baseline calibration
- Maintain consistent scanning distance
- Control environmental conditions where possible
- Escalate abnormal readings to secondary confirmation methods

The most robust approach is to measure deviation from a person's baseline temperature rather than rely on a single screening event.

---

## Strategic Impact

This evaluation demonstrated:

- The difference between manufacturer specification and operational reality
- The importance of calibration traceability
- The need for measurement literacy in crisis deployment scenarios

During a global emergency, devices were adopted at scale with minimal technical validation.

Deep Field provided engineering clarity where assumption had replaced verification.

---

## Deep Field Capability

Deep Field specialises in:

- Instrument validation and verification
- Measurement uncertainty analysis
- Calibration protocol design
- Risk evaluation for sensing systems
- Engineering integrity under operational pressure

We do not accept specification sheets at face value.

We test, validate, quantify, and contextualise.

Because measurement drives decision, and decision drives consequence.
