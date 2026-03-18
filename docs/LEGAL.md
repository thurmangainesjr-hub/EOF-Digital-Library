# EOF Digital Library - Legal Documents

## Creator Adaptation Rights Agreement

### Section 1: Grant of Adaptation Rights

By publishing content on EOF Digital Library with "Adaptation Allowed" enabled, Creator hereby grants to approved Users ("Licensees") a non-exclusive, worldwide license to adapt, transform, and create derivative works from the licensed content ("Source Work"), subject to the following terms and conditions:

#### 1.1 Scope of Rights
The Licensee may:
- Adapt the Source Work into other formats including but not limited to: film, television, video games, audio dramas, graphic novels, stage plays, and interactive media
- Create derivative characters and storylines based on the Source Work
- Use the Source Work for commercial purposes upon payment of applicable fees

#### 1.2 Limitations
The Licensee may NOT:
- Claim original authorship of the Source Work
- Sublicense adaptation rights to third parties without Creator approval
- Create adaptations that materially misrepresent the Creator or Source Work
- Use the Source Work in ways that violate applicable laws or platform terms

### Section 2: Compensation

#### 2.1 Adaptation Fees
- Creator sets the adaptation fee at time of enabling adaptations
- Fees are payable through EOF Digital Library platform
- Platform retains 15% service fee; Creator receives 85%

#### 2.2 Royalties (Optional)
- Creator may require ongoing royalties from commercial adaptations
- Royalty terms must be specified in the adaptation agreement
- Royalty reporting is the responsibility of the Licensee

### Section 3: Attribution Requirements

All adaptations must include:
```
Based on "[TITLE]" by [CREATOR NAME]
Originally published on EOF Digital Library
```

Attribution must appear in:
- Opening/closing credits for video content
- Copyright page for print/digital publications
- About section for interactive media
- Product descriptions for commercial releases

### Section 4: Content Standards

Adaptations must:
- Maintain the general spirit and tone of the Source Work (unless otherwise agreed)
- Not contain unauthorized alterations to protected character names/likenesses
- Comply with all applicable content ratings and regulations
- Not bring the Source Work or Creator into disrepute

### Section 5: Termination

#### 5.1 Creator Termination Rights
Creator may terminate adaptation rights if Licensee:
- Fails to pay required fees within 30 days
- Materially breaches attribution requirements
- Creates content that violates Section 4 standards
- Files for bankruptcy or ceases operations

#### 5.2 Effects of Termination
- Licensee must cease distribution of adaptation within 90 days
- Existing commercial agreements may continue to completion
- Creator retains all payments received

### Section 6: Griot AI Integration

#### 6.1 Automated Export
By approving an adaptation request with Griot AI export:
- Source Work metadata exports to Licensee's Griot AI project
- Character profiles and world-building elements transfer
- Canon rules and timeline data are included

#### 6.2 Data Rights
- Exported data remains subject to this Agreement
- Griot AI platform terms also apply to exported content
- Creator data is never shared with other Griot AI users

### Section 7: Dispute Resolution

- Disputes first addressed through EOF Digital Library support
- Mediation required before legal action
- Arbitration under rules of the American Arbitration Association
- Prevailing party entitled to reasonable attorney fees

### Section 8: Warranties and Disclaimers

#### 8.1 Creator Warranties
Creator warrants that:
- They are the original author or rights holder of the Source Work
- Source Work does not infringe third-party rights
- They have authority to grant adaptation rights

#### 8.2 Platform Disclaimers
EOF Digital Library:
- Does not guarantee Licensee conduct
- Is not party to Creator-Licensee agreements
- Provides platform services only

---

## Acceptance

By enabling "Adaptation Allowed" on your content, you accept these terms.

By requesting adaptation rights, Licensees accept these terms.

Last Updated: January 2024
Version: 1.0

---

# Project Gutenberg Compliance

## Linking Policy

EOF Digital Library integrates Project Gutenberg public domain works in compliance with their trademark license:

### Permitted Uses
- Linking to Gutenberg.org for original downloads
- Displaying Gutenberg catalog information
- Referencing Gutenberg ID numbers

### Required Attribution
All Gutenberg-sourced content displays:
```
This work is from Project Gutenberg (gutenberg.org)
Public Domain - No adaptation rights required
```

### Prohibited Uses
- Hosting Gutenberg files directly without permission
- Removing Gutenberg license headers
- Implying Gutenberg endorsement of EOF platform

### Implementation
```javascript
// Gutenberg content flagged in database
source: ProductSource.GUTENBERG
gutenbergId: "12345"

// Display requirements
if (product.source === 'GUTENBERG') {
  showGutenbergAttribution();
  disableAdaptationFees(); // Public domain = free adaptation
  linkToGutenbergOriginal();
}
```

---

# Terms of Service Summary

## User Obligations
- Accurate account information
- Secure password management
- Compliance with content policies
- Respectful community interaction

## Platform Rights
- Content moderation and removal
- Account suspension for violations
- Service modifications with notice
- Data processing per Privacy Policy

## Membership Terms
- Monthly billing cycle
- Cancel anytime, access until period end
- No refunds for partial periods
- Price changes with 30-day notice

---

# Privacy Policy Summary

## Data Collection
- Account information (email, name)
- Reading activity and preferences
- Payment information (via Stripe)
- Device and usage analytics

## Data Use
- Service provision and improvement
- Personalized recommendations
- Creator analytics and payouts
- Legal compliance

## Data Sharing
- Payment processors (Stripe)
- Griot AI (with user consent for exports)
- Legal requirements only

## User Rights
- Access and export data
- Correction of inaccuracies
- Deletion requests (subject to legal retention)
- Marketing opt-out

---

*Full legal documents available at /legal on the platform*
